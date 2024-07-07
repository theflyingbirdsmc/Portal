import 'xterm/css/xterm.css';
import { discoveryApiRef, useApi } from '@backstage/core-plugin-api';
import { ClusterAttributes } from '@backstage/plugin-kubernetes-common';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React, { useEffect, useMemo, useState } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { PodExecTerminalAttachAddon } from './PodExecTerminalAttachAddon';

export interface PodExecTerminalProps {
  cluster: ClusterAttributes;
  containerName: string;
  podName: string;
  podNamespace: string;
}

const hasSocketProtocol = (url: string | URL) => /wss?:\/\//.test(url.toString());

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    podExecTerminal: {
      width: '100%',
      height: '100%',
      '& .xterm-screen': { padding: theme.spacing(1) },
    },
  }),
);

export const PodExecTerminal = (props: PodExecTerminalProps) => {
  const classes = useStyles();
  const { containerName, podNamespace, podName } = props;
  const [baseUrl, setBaseUrl] = useState(window.location.host);
  const terminalRef = React.useRef(null);
  const discoveryApi = useApi(discoveryApiRef);
  const namespace = podNamespace ?? 'default';

  useEffect(() => {
    discoveryApi
      .getBaseUrl('kubernetes')
      .then(url => url ?? window.location.host)
      .then(url => url.replace(/^http(s?):\/\//, 'ws$1://'))
      .then(url => setBaseUrl(url));
  }, [discoveryApi]);

  const urlParams = useMemo(() => {
    const params = new URLSearchParams();
    params.append('container', containerName);
    params.append('stdin', 'true');
    params.append('stdout', 'true');
    params.append('stderr', 'true');
    params.append('tty', 'true');
    params.append('command', '/bin/bash');
    params.append('command', '-c');
    params.append('command', 'screen -x minecraft');
    return params;
  }, [containerName]);

  const socketUrl = useMemo(() => {
    if (!hasSocketProtocol(baseUrl)) {
      return '';
    }

    return new URL(
      `${baseUrl}/proxy/api/v1/namespaces/${namespace}/pods/${podName}/exec?${urlParams}`,
    );
  }, [baseUrl, namespace, podName, urlParams]);

  useEffect(() => {
    if (!hasSocketProtocol(socketUrl)) {
      return () => { };
    }

    const terminal = new Terminal();
    const fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);

    if (terminalRef.current) {
      terminal.open(terminalRef.current);
      fitAddon.fit();
    }

    terminal.writeln('Starting terminal, please wait...');

    const socket = new WebSocket(socketUrl, ['channel.k8s.io']);

    socket.onopen = () => {
      terminal.clear();
      const attachAddon = new PodExecTerminalAttachAddon(socket, {
        bidirectional: true,
      });

      terminal.loadAddon(attachAddon);
    };

    socket.onclose = () => {
      terminal.writeln('Socket connection closed');
    };

    return () => {
      terminal?.clear();
      socket?.close();
    };
  }, [baseUrl, socketUrl]);

  return (
    <div
      data-testid="terminal"
      ref={terminalRef}
      className={classes.podExecTerminal}
    />
  );
};
