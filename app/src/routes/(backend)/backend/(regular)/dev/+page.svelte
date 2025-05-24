<script lang="ts">
  import Input from '$d2/components/dark/input.svelte';
  import Json from '$d2/components/dark/json.svelte';
  import { CreateSubscriptionModel } from '$d2/lib/subscriptions/create.svelte';

  let model = new CreateSubscriptionModel({ kind: 'foof' });
</script>

<div class="dev">
  <div class="row">
    <Input value={model.email} onInput={(value) => (model.email = value)} onEnter={() => model.save()} />
  </div>
  <div class="row">
    <Json data={model.serialized} />
  </div>
</div>

<style lang="scss">
  .dev {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px;
  }
</style>
