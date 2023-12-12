import React, { useState, useEffect } from 'react';
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

// Import xterm.js
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';

export const ConsoleComponent = () => {
  const [command, setCommand] = useState('');
  const [terminal, setTerminal] = useState<Terminal | null>(null);

  useEffect(() => {
    // Create xterm.js Terminal
    const term = new Terminal();

    // Get the element by ID
    const terminalElement = document.getElementById('terminal');

    if (terminalElement) {
      term.open(terminalElement);
      setTerminal(term);

      // Example command
      term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ');

      // Handle user input
      term.onData((data) => {
        // Data received from the terminal, you can process it here
        console.log('Data received:', data);
      });

      // Listen for a resize request and update the terminal size
      term.onResize((size) => {
        console.log('Terminal resized:', size);
      });

      return () => {
        // Clean up xterm.js Terminal when the component is unmounted
        term.dispose();
      };
    } else {
      console.error('Element with id "terminal" not found.');
      return undefined;
    }
  }, []); // Run this effect once when the component mounts

  const handleKeyDown = (event: any) => {
    if (event.keyCode === 13) {
      // Enter key pressed
      rconSendCommand(command);
      // You can add additional logic here, such as clearing the TextField
      setCommand('');
    } else {
      // Pass other key events to xterm.js
      if (terminal) {
        terminal.write(event.key);
      }
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
            {/* Add a div for xterm.js to attach to */}
            <div
              id="terminal"
              style={{ height: '400px' }}
              onKeyDown={handleKeyDown}
              tabIndex={0}
            ></div>
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
