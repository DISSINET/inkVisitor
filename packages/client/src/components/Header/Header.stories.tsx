import * as React from "react";
import { Header, Button } from "components";

export default {
  title: "Header",
  parameters: {
    info: { inline: true },
  },
};

export const DefaultHeader = () => {
  return <Header color={"primary"} />;
};

export const LeftButtonContentHeader = () => {
  return (
    <Header left={<Button label="button on the left side" color="success" />} />
  );
};

export const LeftLabelContentHeader = () => {
  return <Header left={<h1>Header title</h1>} />;
};

export const RightSimpleContentHeader = () => {
  return (
    <Header
      right={<Button color="danger" label="button on the right side" />}
    />
  );
};
export const RightAndLeftSimpleContentHeader = () => {
  return (
    <Header
      left={<div className="text-5xl">header</div>}
      right={<Button label="button on the right side" inverted />}
    />
  );
};

export const RightAndLeftTextContentHeader = () => {
  return (
    <Header
      left={<div className="text-5xl">very very long and big header</div>}
      right={<div className="text-sm">logged as admin</div>}
    />
  );
};

export const VariousSizesHeader = () => {
  return (
    <div>
      <Header
        left={<div>header with auto height</div>}
        right={<div>right content</div>}
      />
      <br />

      <Header
        height={50}
        color={"info"}
        left={<div className="text-xl">header with 50pxs</div>}
        right={<div className="text-sm">right content</div>}
      />
      <br />

      <Header
        height={100}
        color={"warning"}
        left={<div className="text-xl">header with 100pxs</div>}
        right={<div className="text-sm">right content</div>}
      />
      <br />

      <Header
        height={250}
        color={"danger"}
        left={<div className="text-xl">header with 250pxs</div>}
        right={<div className="text-sm">right content</div>}
      />
      <br />

      <Header
        height={50}
        color={"success"}
        left={
          <div className="text-xl">
            Very long text that would probably wrap and the user does not see
            the full length while the header is too narrow
          </div>
        }
        right={<div className="text-sm">right content</div>}
      />
    </div>
  );
};

export const CustomPaddingHeader = () => {
  return (
    <div>
      <Header
        paddingX={80}
        paddingY={0}
        left={<div className="text-xl">no Y padding</div>}
        right={<div className="text-sm">right content</div>}
      />

      <br />
      <Header
        paddingX={0}
        paddingY={80}
        left={<div className="text-xl">no X padding</div>}
        right={<div className="text-sm">right content</div>}
      />
    </div>
  );
};
