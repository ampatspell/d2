<script lang="ts">
  // import { FirebaseModel } from '$d2/lib/base/refactoring/fire/model.svelte';
  import { SubscribableModel } from '$d2/lib/base/refactoring/subscribable.svelte';
  import Dark from './dark.svelte';
  import Overflow from './overflow.svelte';
  import Cell from './table/cell.svelte';
  import Content from './table/content.svelte';
  import Row from './table/row.svelte';
  import Table from './table/table.svelte';

  let models = $derived(SubscribableModel.subscribed);
  // let models = $derived(FirebaseModel.listening);
</script>

<div class="stats">
  <Dark>
    <Overflow overflow="y">
      <Table>
        {#each models as model (model)}
          <Cell>
            <Row>
              <Content>
                {model.description}
              </Content>
            </Row>
          </Cell>
        {/each}
      </Table>
    </Overflow>
  </Dark>
</div>

<style lang="scss">
  @use 'sass:color';
  .stats {
    position: fixed;
    bottom: 5px;
    right: 5px;
    width: 500px;
    height: 300px;
    box-shadow:
      0 5px 10px color.adjust(#000, $alpha: -0.95),
      0 20px 40px color.adjust(#000, $alpha: -0.95);
    border: 1px solid color.adjust(#000, $alpha: -0.95);
    overflow: hidden;
    border-radius: 3px;
    background: #fff;
    display: flex;
    flex-direction: column;
  }
</style>
