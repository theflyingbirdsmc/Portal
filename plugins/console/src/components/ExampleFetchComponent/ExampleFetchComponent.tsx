import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Table,
  TableColumn,
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import useAsync from 'react-use/lib/useAsync';
import {
  catalogApiRef,
} from '@backstage/plugin-catalog-react';
import { useApi } from '@backstage/core-plugin-api';

const useStyles = makeStyles({
  avatar: {
    height: 32,
    width: 32,
    borderRadius: '50%',
  },
});

type User = {
  gender: string; // "male"
  name: {
    title: string; // "Mr",
    first: string; // "Duane",
    last: string; // "Reed"
  };
  email: string; // "duane.reed@example.com"
  picture: string; // "https://api.dicebear.com/6.x/open-peeps/svg?seed=Duane"
  nat: string; // "AU"
};

type DenseTableProps = {
  users: User[];
};

export const DenseTable = ({ users }: DenseTableProps) => {
  const classes = useStyles();

  const columns: TableColumn[] = [
    { title: 'Avatar', field: 'avatar' },
    { title: 'Name', field: 'name' },
    { title: 'Email', field: 'email' },
    { title: 'Nationality', field: 'nationality' },
  ];

  const data = users.map(user => {
    return {
      avatar: (
        <img
          src={user.picture}
          className={classes.avatar}
          alt={user.name.first}
        />
      ),
      name: `${user.name.first} ${user.name.last}`,
      email: user.email,
      nationality: user.nat,
    };
  });

  return (
    <Table
      title="Example User List"
      options={{ search: false, paging: false }}
      columns={columns}
      data={data}
    />
  );
};

function getServers() {
  const catalogApi = useApi(catalogApiRef);

  const { value: catalogResponse } = useAsync(async () => {
    try {
      const response = await catalogApi.getEntities({
        filter:
          { 'metadata.annotations': 'backstage.io/kubernetes-id' },
      });

      const entityNames = response?.items.map((item: any) => {

        return {
          name: item.metadata.name
        };
      }) || [];

      return entityNames;
    } catch (err) {
      throw new Error(`Error fetching entities: ${err}`);
    }
  }, [catalogApi]);

  return catalogResponse || [];
}

// console.log(getServers());

export const FetchServers = () => {

  const { value, loading, error } = useAsync(async (): Promise<any> => {
    const servers = getServers();
    console.log(servers);
    return servers;
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  return <DenseTable users={value || []} />;
};
