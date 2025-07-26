import { useState } from "react";

import { LeftPanel, RightPanel } from "@/components/layouts/editor-layout";

export default function BlockEditorPage() {
  return (
    <>
      <LeftPanel>
        <LeftPanel.Tab label="Tab1">
          <div>Content for Tab 1</div>
        </LeftPanel.Tab>
        <LeftPanel.Tab label="Tab2">
          <div>Content for Tab 2</div>
        </LeftPanel.Tab>
      </LeftPanel>
      <div>acutal content here</div>
      <RightPanel>
        <RightPanel.Tab label="OnlyTab">
          <div>Only tab content</div>
        </RightPanel.Tab>
      </RightPanel>
    </>
  );
}
