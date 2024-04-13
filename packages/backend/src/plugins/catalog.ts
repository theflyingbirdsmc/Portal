import { CatalogBuilder } from '@backstage/plugin-catalog-backend';
import { ScaffolderEntitiesProcessor } from '@backstage/plugin-scaffolder-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';
import { GithubEntityProvider, GithubMultiOrgEntityProvider, defaultUserTransformer } from '@backstage/plugin-catalog-backend-module-github';

export default async function createPlugin(
    env: PluginEnvironment,
): Promise<Router> {
    const builder = await CatalogBuilder.create(env);
    // The org URL below needs to match a configured integrations.github entry
    // specified in your app-config.
    builder.addEntityProvider(
        GithubEntityProvider.fromConfig(env.config, {
            logger: env.logger,
            // optional: alternatively, use scheduler with schedule defined in app-config.yaml
            // schedule: env.scheduler.createScheduledTaskRunner({
            //   frequency: { minutes: 30 },
            //   timeout: { minutes: 3 },
            // }),
            // optional: alternatively, use schedule
            scheduler: env.scheduler,
        }),
    );
    const githubOrgEntityProvider = GithubMultiOrgEntityProvider.fromConfig(env.config, {
        id: 'production',
        githubUrl: 'https://github.com',
        orgs: ['theflyingbirdsmc'],
        logger: env.logger,
        schedule: env.scheduler.createScheduledTaskRunner({
            frequency: { minutes: 2 },
            timeout: { minutes: 15 },
        }),
        userTransformer: async (user, ctx) => {
            const entity = await defaultUserTransformer(user, ctx);

            if (entity && user.organizationVerifiedDomainEmails?.length) {
                entity.spec.profile!.email = user.organizationVerifiedDomainEmails[0];
            }

            return entity;
        },
    });

    builder.addEntityProvider(githubOrgEntityProvider);
    builder.addProcessor(new ScaffolderEntitiesProcessor());

    const { processingEngine, router } = await builder.build();
    await processingEngine.start();

    return router;
}