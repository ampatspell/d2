<script lang="ts">
  import { fireStats } from '$d2/lib/base/fire/stats.svelte';
  // import { modelStats } from '$d2/lib/base/model/stats.svelte';
  import Dark from './dark.svelte';
  import Overflow from './overflow.svelte';
  import Cell from './table/cell.svelte';
  import Content from './table/content.svelte';
  import Row from './table/row.svelte';
  import Table from './table/table.svelte';

  let listening = $derived(fireStats.listening);
  // let subscribed = $derived(modelStats.subscribed);
</script>

<div class="stats">
  <Dark>
    <Overflow overflow="y">
      <Table>
        {#each listening as model (model)}
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
  .stats {
    position: fixed;
    bottom: 5px;
    right: 5px;
    width: 500px;
    height: 300px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
    background: #fff;
    display: flex;
    flex-direction: column;
  }
</style>
