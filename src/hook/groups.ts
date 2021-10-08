import { reactive, watch } from "vue";
import api from "../lib/api";

export default function getAllGroups() {
  const userState = reactive({
    loading: false,
    error: "",
    response: {},
  });

  async function loadData() {
    try {
      userState.loading = true;
      userState.error = "";
      userState.response = await api.getGroup();
    } catch (error) {
      userState.error = `${error}`;
      console.log(error);
    } finally {
      userState.loading = false;
    }
  }

  watch(() => userState, loadData, { immediate: true });
  loadData();

  return userState;
}
