import { watch } from 'vue';
import { useMainStore } from "@/stores/mainStore.js";
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";

export default function useDarkMode() {
  const mainStore = useMainStore();
  const { isDark } = storeToRefs(mainStore);
  const $q = useQuasar();

  watch(isDark, (value) => {
    $q.dark.set(value);
  }, { immediate: true });


  return { isDark };
}