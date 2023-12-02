import React, { useState } from 'react';
import { Typography, Grid, TextField, Box } from '@material-ui/core';
import {
  InfoCard,
  Header,
  Page,
  Content,
  ContentHeader,
  HeaderLabel,
  SupportButton,
} from '@backstage/core-components';
import { ConsoleFetchComponent, rconSendCommand } from '../ConsoleFetchComponent';

export const ConsoleComponent = () => {
  const [command, setCommand] = useState('');

  const handleKeyDown = (event: any) => {
    if (event.keyCode === 13) {
      // Enter key pressed
      rconSendCommand(command);
      // You can add additional logic here, such as clearing the TextField
      setCommand('');
    }
  };

  return (
    <Page themeId="tool">
      <Header title="Welcome to console!" subtitle="Optional subtitle">
        <HeaderLabel label="Owner" value="Team X" />
        <HeaderLabel label="Lifecycle" value="Alpha" />
      </Header>
      <Content>
        <ContentHeader title="Lobby">
          <SupportButton>Console-rcon plugin for Minecraft</SupportButton>
        </ContentHeader>
        <Grid container spacing={3} direction="column">
          <Grid item>
            <ConsoleFetchComponent />
          </Grid>
          <Box sx={{ width: '100%', maxWidth: '100%' }}>
            <TextField
              fullWidth
              label="Command"
              id="fullWidth"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </Box>
        </Grid>
      </Content>
    </Page>
  );
};
