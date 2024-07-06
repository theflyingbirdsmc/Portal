import { useApi } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { useAsync } from 'react-use';

export function getServers() {
    const catalogApi = useApi(catalogApiRef);

    const { value: catalogResponse } = useAsync(async () => {
        try {
            const response = await catalogApi.getEntities({
                filter: { 'metadata.annotations': 'backstage.io/kubernetes-id' },
            });

            const entityNames = response?.items.map((item: any) => ({
                name: item.metadata.name,
            })) || [];

            return entityNames;
        } catch (err) {
            throw new Error(`Error fetching entities: ${err}`);
        }
    }, [catalogApi]);

    return catalogResponse || [];
}
