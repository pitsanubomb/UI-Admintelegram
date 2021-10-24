import { reactive, watch } from "vue";
import api from "../lib/api";

export default function getAllChannels() {
  const channelState = reactive({
    loading: false,
    error: "",
    response: {},
  });

  async function loadData() {
    try {
      channelState.loading = true;
      channelState.error = "";
      channelState.response = await api.getChannel();
    } catch (error) {
      channelState.error = `${error}`;
      console.log(error);
    } finally {
      channelState.loading = false;
    }
  }

  watch(() => channelState, loadData, { immediate: true });
  loadData();

  return channelState;
}
