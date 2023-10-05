<script>
  import { page } from "$app/stores";
  import Home from "@rilldata/web-common/components/icons/Home.svelte";
  import Tooltip from "@rilldata/web-common/components/tooltip/Tooltip.svelte";
  import TooltipContent from "@rilldata/web-common/components/tooltip/TooltipContent.svelte";
  import { createAdminServiceGetCurrentUser } from "../../client";
  import ViewAsUserChip from "../../features/view-as-user/ViewAsUserChip.svelte";
  import { viewAsUserStore } from "../../features/view-as-user/viewAsUserStore";
  import AvatarButton from "../authentication/AvatarButton.svelte";
  import SignIn from "../authentication/SignIn.svelte";
  import ShareButton from "../dashboards/share/ShareButton.svelte";
  import { isErrorStoreEmpty } from "../errors/error-store";
  import Breadcrumbs from "./Breadcrumbs.svelte";
  import { isDashboardPage } from "./nav-utils";

  $: organization = $page.params.organization;
  $: onDashboardPage = isDashboardPage($page);

  const user = createAdminServiceGetCurrentUser();
</script>

<div
  class="border-b grid items-center w-full justify-stretch pr-4"
  style:grid-template-columns="max-content auto max-content"
>
  <Tooltip distance={2}>
    <a
      href="/"
      class="inline-flex items-center hover:bg-gray-200 grid place-items-center rounded"
      style:margin-left="8px"
      style:margin-top="4px"
      style:margin-bottom="4px"
      style:height="36px"
      style:width="36px"
    >
      <Home size="20px" color="black" />
    </a>
    <TooltipContent slot="tooltip-content">Home</TooltipContent>
  </Tooltip>
  {#if $isErrorStoreEmpty && organization}
    <Breadcrumbs />
  {:else}
    <div />
  {/if}
  <div class="flex gap-x-4 items-center">
    {#if $viewAsUserStore}
      <ViewAsUserChip />
    {/if}
    {#if onDashboardPage}
      <ShareButton />
    {/if}
    {#if $user.isSuccess}
      {#if $user.data && $user.data.user}
        <AvatarButton />
      {:else}
        <SignIn />
      {/if}
    {/if}
  </div>
</div>