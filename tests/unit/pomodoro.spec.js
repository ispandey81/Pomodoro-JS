import { mount } from "@vue/test-utils";
import App from "@/App.vue";

describe("App.vue", () => {
  const wrapper = mount(App);
  it("checks if the app is mounted", () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("checks if a div with an id attribute of app exists", () => {
    expect(wrapper.attributes()["id"]).toBe("app");
  });
});
