import React, { useState, useEffect, useRef } from 'react';
import { Select, MenuItem, FormControl, InputLabel } from '@material-ui/core';
import {
  Header,
  Page,
  Content,
  ContentHeader,
  HeaderLabel,
  SupportButton,
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import { PodExecTerminal, PodExecTerminalProps } from '@backstage/plugin-kubernetes-react';
import { getServers } from './FetchServers';

export const ConsoleComponent = () => {
  const servers = getServers();
  const [selectedServer, setSelectedServer] = useState<string>('');
  const [key, setKey] = useState<number>(0);
  const terminalContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (servers.length > 0) {
      setSelectedServer(servers[0].name);
    }
  }, [servers]);

  const handleServerChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedServer(event.target.value as string);
    setKey(prevKey => prevKey + 1); // Change key to force re-mount
  };

  useEffect(() => {
    if (terminalContainerRef.current) {
      const terminalSpans = terminalContainerRef.current.querySelectorAll('.xterm-rows span');
      const commandSpan = Array.from(terminalSpans).find(span => span.textContent === '# ');

      if (commandSpan) {
        const command = "ls -la";
        let currentCommand = commandSpan.textContent || '';

        for (const char of command) {
          const keydownEvent = new KeyboardEvent('keydown', { key: char });
          commandSpan.dispatchEvent(keydownEvent);
          currentCommand += char;
          commandSpan.textContent = currentCommand; // Update the span's textContent
        }

        // Simulate pressing enter
        const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
        commandSpan.dispatchEvent(enterEvent);
      }
    }
  }, [key]);

  const props: PodExecTerminalProps = {
    cluster: { name: "microk8s" }, // Adjust based on selected server if needed
    containerName: selectedServer || "danish-survival", // Adjust based on selected server
    podName: `${selectedServer}-0`, // Adjust based on selected server
    podNamespace: "tfb-servers", // Adjust based on selected server
  };

  if (servers.length === 0) {
    return <Progress />;
  }

  return (
    <Page themeId="tool">
      <Header title="Welcome to console!" subtitle="Optional subtitle">
        <HeaderLabel label="Owner" value="Team X" />
        <HeaderLabel label="Lifecycle" value="Alpha" />
      </Header>
      <Content>
        <ContentHeader title="Plugin title">
          <SupportButton>A description of your plugin goes here.</SupportButton>
        </ContentHeader>
        <FormControl variant="outlined" style={{ minWidth: 200, marginBottom: 20 }}>
          <InputLabel id="server-select-label">Select Server</InputLabel>
          <Select
            labelId="server-select-label"
            id="server-select"
            value={selectedServer}
            onChange={handleServerChange}
            label="Select Server"
          >
            {servers.map((server) => (
              <MenuItem key={server.name} value={server.name}>
                {server.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <div ref={terminalContainerRef}>
          {selectedServer && <PodExecTerminal key={key} {...props} />}
        </div>
      </Content>
    </Page>
  );
};
