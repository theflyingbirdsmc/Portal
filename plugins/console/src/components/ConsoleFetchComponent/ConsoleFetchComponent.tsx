import React, { useEffect, useState } from 'react';
import { LogViewer } from '@backstage/core-components';
// import { fetchEventSource } from '@microsoft/fetch-event-source';
const { Client } = require('ssh2');
const conn = new Client();

// const exampleLog =
//   `  \u001b[37m[21:51:29 \u001b[31mERROR\u001b[37m]: [PlaceholderAPI] Failed to load expansion Expansion-LuckPerms-5.4.jar, as it does not have a class which extends PlaceholderExpansion\u001b[0m
//   \u001b[37m[21:51:29 \u001b[32mINFO\u001b[37m]: [DecentHolograms] Loading holograms... \u001b[0m
//   \u001b[37m[21:51:29 \u001b[32mINFO\u001b[37m]: [DecentHolograms] Created directory plugins/DecentHolograms/animations\u001b[0m
//   \u001b[37m[21:51:29 \u001b[32mINFO\u001b[37m]: A newer version of DecentHolograms is available. Download it from: https://www.spigotmc.org/resources/96927/\u001b[0m
//   \u001b[37m[21:51:29 \u001b[32mINFO\u001b[37m]: [GadgetsMenu] Checking for updates...\u001b[0m
//   \u001b[37m[21:51:29 \u001b[32mINFO\u001b[37m]: [Plan] You're using the latest version.\u001b[0m
//   \u001b[37m[21:51:29 \u001b[32mINFO\u001b[37m]: [DecentHolograms] Loaded 1 holograms!\u001b[0m
//   \u001b[37m[21:51:29 \u001b[32mINFO\u001b[37m]: [GadgetsMenu] You have an old version of the plugin. You are using 5.13.4, available version 5.14.0.\u001b[0m
//   \u001b[37m[21:51:29 \u001b[32mINFO\u001b[37m]: Done (23.674s)! For help, type "help"\u001b[0m
//   \u001b[37m[21:51:29 \u001b[32mINFO\u001b[37m]: Timings Reset\u001b[0m
//   \u001b[37m[21:51:29 \u001b[32mINFO\u001b[37m]: com.mojang.authlib.GameProfile@2126c462[id=f9dd5e0f-0d65-4f18-b6a9-6142898c4883,name=Fuglen,properties={textures=[com.mojang.authlib.properties.Property@14929b25]},legacy=false] (/95.216.4.245:49503) lost connection: Disconnected\u001b[0m
//   \u001b[37m[21:51:29 \u001b[32mINFO\u001b[37m]: UUID of player Fuglen is f9dd5e0f-0d65-4f18-b6a9-6142898c4883\u001b[0m
//   \u001b[37m[21:51:29 \u001b[32mINFO\u001b[37m]: UUID of player Fuglen is f9dd5e0f-0d65-4f18-b6a9-6142898c4883\u001b[0m
//   \u001b[37m[21:51:29 \u001b[32mINFO\u001b[37m]: Fuglen joined the game\u001b[0m
//   \u001b[37m[21:51:29 \u001b[32mINFO\u001b[37m]: Fuglen[/95.216.4.245:16695] logged in with entity id 9 at ([world_lobby]31.676286880060367, 132.0, -21.259391900742997)\u001b[0m
//   \u001b[37m[21:51:30 \u001b[32mINFO\u001b[37m]: [PlaceholderAPI] Successfully registered external expansion: essentials [1.5.2]\u001b[0m
//   \u001b[37m[21:51:30 \u001b[32mINFO\u001b[37m]: [PAPI] [Javascript-Expansion] 22 scripts loaded!\u001b[0m
//   \u001b[37m[21:51:30 \u001b[32mINFO\u001b[37m]: [PlaceholderAPI] Successfully registered external expansion: javascript [2.1.2]\u001b[0m
//   \u001b[37m[21:51:30 \u001b[32mINFO\u001b[37m]: [PlaceholderAPI] Successfully registered external expansion: pinger [1.0.1]\u001b[0m
//   \u001b[37m[21:51:30 \u001b[32mINFO\u001b[37m]: [PlaceholderAPI] Successfully registered external expansion: server [2.6.2]\u001b[0m
//   \u001b[37m[21:51:30 \u001b[32mINFO\u001b[37m]: [PlaceholderAPI] Successfully registered external expansion: player [2.0.7]\u001b[0m
//   \u001b[37m[21:51:30 \u001b[33mWARN\u001b[37m]: [PlaceholderAPI] Failed to load external expansion votingplugin. Identifier is already in use.\u001b[0m
//   \u001b[37m[21:51:30 \u001b[33mWARN\u001b[37m]: [PlaceholderAPI] Cannot load expansion votingplugin due to an unknown issue.\u001b[0m
//   \u001b[37m[21:51:30 \u001b[32mINFO\u001b[37m]: [ChatControlRed] TIP: Automatically enabling spy mode for Fuglen because they had 'chatcontrol.spy.autoenable' permission. To stop automatically enabling spy mode for players, give them negative 'chatcontrol.spy.autoenable' permission (a value of false when using LuckPerms). This message only shows once per 3 hours.\u001b[0m
//   \u001b[37m[21:51:33 \u001b[33mWARN\u001b[37m]: [VotingPlugin] Detected an issue with voting sites, check the server startup log for more details: https://github.com/BenCodez/VotingPlugin/wiki/Votifier-Troubleshooting\u001b[0m
//   \u001b[37m[21:51:33 \u001b[32mINFO\u001b[37m]: [VotingPlugin] Successfully hooked into vault economy!\u001b[0m
//   \u001b[37m[21:51:33 \u001b[32mINFO\u001b[37m]: [VotingPlugin] Hooked into vault permissions\u001b[0m
//   \u001b[37m[21:51:39 \u001b[32mINFO\u001b[37m]: [VotingPlugin] VotingPlugin has an update available! Your Version: 6.14.1 New Version: 6.14.2\u001b[0m
//   \u001b[37m[21:52:21 \u001b[32mINFO\u001b[37m]: [VotingPlugin] Ignoring time change events for one time only\u001b[0m
//   \u001b[37m[21:55:09 \u001b[32mINFO\u001b[37m]: [com.netflix.config.DynamicPropertyFactory] DynamicPropertyFactory is initialized with configuration sources: com.netflix.config.ConcurrentCompositeConfiguration@1727bd14\u001b[0m
//   \u001b[37m[21:59:03 \u001b[32mINFO\u001b[37m]: [ChatControlRed] Note: Not sending Fuglen's chat to spying players because he had 'chatcontrol.bypass.spy.chat' permission. Player messages with such permission are not spied on. To disable that, negate this permission (a false value if using LuckPerms). This message only shows once per 3 hours.\u001b[0m
//   \u001b[37m[21:59:03 \u001b[32mINFO\u001b[37m]: [ChatControlRed] Note: Not logging Fuglen's chat because he had 'chatcontrol.bypass.log' permission. Players with these permission do not get their content logged. To disable that, negate this permission (a false value if using LuckPerms). This message only shows once per 3 hours.\u001b[0m
//   \u001b[37m[21:59:03 \u001b[32mINFO\u001b[37m]: [ChatControlRed 10.22.3] ChatListener listening to AsyncPlayerChatEvent at HIGH priority took 302.62 ms\u001b[0m
//   \u001b[37m[21:59:03 \u001b[32mINFO\u001b[37m]: \u001b[34m[English]\u001b[37m Fuglen: gg rwege\u001b[0m`

export const ConsoleFetchComponent = () => {

  conn.on('ready', () => {
    console.log('Client :: ready');
    conn.shell((err: any, stream: any) => {
      if (err) throw err;
      stream.on('close', () => {
        console.log('Stream :: close');
        conn.end();
      }).on('data', (data: any) => {
        console.log('OUTPUT: ' + data);
      });
      stream.end('ls -l\nexit\n');
    });
  }).connect({
    host: '10.1.123.29',
    port: 22,
    username: 'tfb',
    password: 'TFB123'
  });

  // const [logs, setLogs] = useState('');

  // useEffect(() => {
  //   fetchEventSource('http://localhost:7007/api/rcon/logs', {
  //     onmessage(ev) {
  //       const newLog = JSON.parse(ev.data).formattedLog;
  //       setLogs((prevLogs) => prevLogs + newLog);
  //     }
  //   });
  // }, []);

  return (
    <div style={{ height: 600 }}>
      <LogViewer text={"Hello"} />
    </div>
  );
};

export const rconSendCommand = async (command: string) => {
  console.log("-----COMMAND-----: " + JSON.stringify({ command }));
  // const [logs, setLogs] = useState('');
  const request = await fetch('http://localhost:7007/api/rcon/command', {
    method: 'POST',
    body: JSON.stringify({ command }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const response = await request.json();
  console.log(response);

  // return (
  //   <div style={{ height: 600 }}>
  //     <LogViewer text={logs} />
  //   </div>
  // );
};