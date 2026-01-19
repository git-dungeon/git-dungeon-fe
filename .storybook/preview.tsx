import type { Preview } from "@storybook/react";
import "../src/index.css";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: { expanded: true },
  },
  decorators: [
    (Story) => (
      <div className="pixel-app font-pixel-body min-h-screen p-6">
        <Story />
      </div>
    ),
  ],
};

export default preview;
