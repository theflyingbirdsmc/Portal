import React from 'react';
// import { Typography, Grid } from '@material-ui/core';
import {
  Header,
  Page,
  Content,
  ContentHeader,
  HeaderLabel,
  SupportButton,
} from '@backstage/core-components';
// import { FetchServers } from '../ExampleFetchComponent';
import { PodExecTerminal, PodExecTerminalProps } from '@backstage/plugin-kubernetes-react';



const props: PodExecTerminalProps = {
  cluster: { name: "microk8s" },
  containerName: "danish-survival",
  podName: "danish-survival-0",
  podNamespace: "tfb-servers",
};

export const ExampleComponent = () => (
  <Page themeId="tool">
    <Header title="Welcome to console!" subtitle="Optional subtitle">
      <HeaderLabel label="Owner" value="Team X" />
      <HeaderLabel label="Lifecycle" value="Alpha" />
    </Header>
    <Content>
      <ContentHeader title="Plugin title">
        <SupportButton>A description of your plugin goes here.</SupportButton>
      </ContentHeader>
      {/* <FetchServers title="What is this?"> */}
        <PodExecTerminal {...props} />;
    </Content>
  </Page>
);
