<script lang="ts">
  let {
    isDisabled,
    value,
    onEnter,
    onInput,
    onBlur,
  }: {
    isDisabled?: boolean;
    value: string | undefined;
    onEnter?: (value: string) => void;
    onInput?: (value: string) => void;
    onBlur?: () => void;
  } = $props();

  let initial: string | undefined;

  let targetAsInput = (e: Event) => {
    return e.target as HTMLInputElement;
  };

  let onkeyup = (e: KeyboardEvent) => {
    let input = targetAsInput(e);
    if (e.key === 'Enter') {
      onEnter?.(input.value);
      input.blur();
    } else if (e.key === 'Escape') {
      onInput?.(initial ?? '');
      input.blur();
    }
  };

  let onfocus = () => {
    initial = value;
  };

  let onblur = (e: Event) => {
    let input = targetAsInput(e);
    input.value = value ?? '';
    initial = undefined;
    onBlur?.();
  };

  let oninput = (e: Event) => {
    let input = targetAsInput(e);
    onInput?.(input.value);
  };

  let disabled = $derived(isDisabled);
</script>

<input type="text" class="input" {disabled} {value} {oninput} {onkeyup} {onfocus} {onblur} />

<style lang="scss">
  .input {
    width: 100%;
    outline: none;
    border: 1px solid var(--dark-border-color-1);
    padding: 5px 5px;
    border-radius: 3px;
  }
</style>
