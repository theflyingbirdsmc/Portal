import 'xterm/css/xterm.css';
import './CustomColors.css'; // your custom styles
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
  command?: string; // Optional command property
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
  const { containerName, podNamespace, podName, command } = props;
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

    if (command) {
      params.append('command', '-c');
      params.append('command', command);
    }

    return params;
  }, [containerName, command]);

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

    const terminal = new Terminal({
      theme: {
        background: '#1d1f21',
        foreground: '#c5c8c6',
        cursor: '#c5c8c6',
        black: '#1d1f21',
        red: '#cc6666',
        green: '#b5bd68',
        yellow: '#f0c674',
        blue: '#81a2be',
        magenta: '#b294bb',
        cyan: '#8abeb7',
        white: '#c5c8c6',
        brightBlack: '#666666',
        brightRed: '#d54e53',
        brightGreen: '#b9ca4a',
        brightYellow: '#e7c547',
        brightBlue: '#7aa6da',
        brightMagenta: '#c397d8',
        brightCyan: '#70c0b1',
        brightWhite: '#eaeaea',
      },
    });
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
