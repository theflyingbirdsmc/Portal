import React, { useState } from 'react';
import { Select, MenuItem, FormControl, InputLabel } from '@material-ui/core';
import {
  Header,
  Page,
  Content,
  ContentHeader,
  HeaderLabel,
  SupportButton,
} from '@backstage/core-components';
import { PodExecTerminal, PodExecTerminalProps } from '@backstage/plugin-kubernetes-react';
import { getServers } from './FetchServers';

export const ConsoleComponent = () => {
  const servers = getServers();
  const [selectedServer, setSelectedServer] = useState<string | undefined>(servers[0]?.name);

  const handleServerChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedServer(event.target.value as string);
  };

  const props: PodExecTerminalProps = {
    cluster: { name: "microk8s" }, // Adjust based on selected server if needed
    containerName: selectedServer || "default-container", // Adjust based on selected server
    podName: "danish-survival-0", // Adjust based on selected server
    podNamespace: "tfb-servers", // Adjust based on selected server
  };

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
        <FormControl variant="outlined" style={{ minWidth: 200 }}>
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
        <PodExecTerminal {...props} />;
      </Content>
    </Page>
  );
};
