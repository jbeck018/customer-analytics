import {
  createConnectorServiceOLAPGetTable,
  createRuntimeServiceGetResource,
  createRuntimeServiceListResources,
  V1ListResourcesResponse,
  V1ModelV2,
  V1ReconcileStatus,
  V1Resource,
  V1SourceV2,
} from "@rilldata/web-common/runtime-client";
import type { QueryClient } from "@tanstack/svelte-query";

export enum ResourceKind {
  ProjectParser = "rill.runtime.v1.ProjectParser",
  Source = "rill.runtime.v1.Source",
  Model = "rill.runtime.v1.Model",
  MetricsView = "rill.runtime.v1.MetricsView",
}
export const SingletonProjectParserName = "parser";

export function useResource<T = V1Resource>(
  instanceId: string,
  name: string,
  kind: ResourceKind,
  selector?: (data: V1Resource) => T,
  queryClient?: QueryClient
) {
  return createRuntimeServiceGetResource(
    instanceId,
    {
      "name.kind": kind,
      "name.name": name,
    },
    {
      query: {
        select: (data) =>
          (selector ? selector(data?.resource) : data?.resource) as T,
        enabled: !!instanceId && !!name && !!kind,
        queryClient,
      },
    }
  );
}

export function useProjectParser(queryClient: QueryClient, instanceId: string) {
  return useResource(
    instanceId,
    SingletonProjectParserName,
    ResourceKind.ProjectParser,
    undefined,
    queryClient
  );
}

export function useFilteredResources<T = Array<V1Resource>>(
  instanceId: string,
  kind: ResourceKind,
  selector: (data: V1ListResourcesResponse) => T = (data) => data.resources as T
) {
  return createRuntimeServiceListResources(
    instanceId,
    {
      kind,
    },
    {
      query: {
        select: selector,
      },
    }
  );
}

export function useFilteredResourceNames(
  instanceId: string,
  kind: ResourceKind
) {
  return useFilteredResources<Array<string>>(instanceId, kind, (data) =>
    data.resources.map((res) => res.meta.name.name)
  );
}

export function useAllNames(instanceId: string) {
  return createRuntimeServiceListResources(
    instanceId,
    {},
    {
      query: {
        select: (data) => data.resources.map((res) => res.meta.name.name),
      },
    }
  );
}

export function useSchemaForTable(
  instanceId: string,
  tableSpec: V1ModelV2 | V1SourceV2
) {
  return createConnectorServiceOLAPGetTable(
    {
      instanceId,
      table: tableSpec?.state?.table,
      connector: tableSpec?.state?.connector,
    },
    {
      query: {
        enabled: !!tableSpec?.state?.table && !!tableSpec?.state?.connector,
      },
    }
  );
}

export function resourceIsLoading(resource: V1Resource) {
  return (
    !!resource &&
    resource.meta?.reconcileStatus !== V1ReconcileStatus.RECONCILE_STATUS_IDLE
  );
}
