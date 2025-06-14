<script lang="ts">
  import type { UploadFilesModalProps, UploadFilesModalResolution } from './models.svelte';
  import type { ModalRuntime } from '$d2/components/dark/modals/base/modal.svelte';
  import Overflow from '$d2/components/dark/overflow.svelte';
  import Table from '$d2/components/dark/table/table.svelte';
  import Cell from '$d2/components/dark/table/cell.svelte';
  import Icon from '$d2/components/dark/icon.svelte';
  import LucideTrash_2 from '$d2/icons/lucide--trash-2.svelte';
  import Actions from '$d2/components/dark/modals/modal/actions.svelte';
  import Button from '$d2/components/dark/button.svelte';
  import Modal from '$d2/components/dark/modals/modal/modal.svelte';
  import Header from '$d2/components/dark/modals/modal/header.svelte';
  import Files from '$d2/components/dark/files.svelte';
  import type { UploadFileModel } from '$d2/lib/nodes/node/upload.svelte';

  let { modal }: { modal: ModalRuntime<UploadFilesModalProps, UploadFilesModalResolution> } = $props();

  let node = $derived(modal.props.node);
  let upload = $derived(node.upload());

  let files = $derived(upload.primitive);
  let onFiles = async (files: File[]) => {
    upload.onFiles(files);
  };

  let onUpload = async () => {
    await modal.withBusy(async () => {
      await upload.onUpload();
    });
    modal.resolve(true);
  };

  let onCancel = () => {
    modal.resolve(false);
  };

  let isCancelDisabled = $derived(upload.isBusy);
  let isUploadDisabled = $derived(upload.isBusy || upload.files.length === 0);

  let title = $derived.by(() => {
    if (upload.isBusy) {
      return `Uploading ${upload.progress}%…`;
    }
    return 'Upload files';
  });

  let onRemove = (file: UploadFileModel) => () => file.remove();
</script>

<Modal size={{ width: 500, height: 400 }}>
  <Header {title} />
  <div class="content">
    {#if files.length === 0}
      <div class="blank">
        <Files {onFiles} />
      </div>
    {:else}
      <div class="table">
        <Overflow overflow="y">
          <Table>
            {#each upload.files as file (file)}
              <Cell>
                <div class="row">
                  <div class="name">{file.name}</div>
                  <div class="accessories">
                    {#if file.status === 'uploading'}
                      {file.progress}%
                    {:else if file.status === 'uploaded'}
                      Uploaded
                    {:else}
                      <Icon icon={LucideTrash_2} onClick={onRemove(file)} />
                    {/if}
                  </div>
                </div>
              </Cell>
            {/each}
          </Table>
        </Overflow>
      </div>
    {/if}
  </div>
  <Actions>
    <Button label="Cancel" onClick={onCancel} isDisabled={isCancelDisabled} />
    <Button label="Upload" onClick={onUpload} isDisabled={isUploadDisabled} />
  </Actions>
</Modal>

<style lang="scss">
  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    > .blank {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    > .table {
      flex: 1;
      display: flex;
      flex-direction: column;
      margin: 0 -10px;
      border-top: 1px solid var(--dark-border-color-1);
      border-bottom: 1px solid var(--dark-border-color-1);
    }
  }

  .row {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    > .name {
      flex: 1;
    }
    > .accessories {
      user-select: none;
    }
  }
</style>
