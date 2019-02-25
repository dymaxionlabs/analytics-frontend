import React from "react";
import { Segment, Header, List } from "semantic-ui-react";

const ColorBlock = ({ value }) => (
  <div>
    <style jsx>{`
      div {
        border: 1px solid #000;
        width: 16px;
        height: 16px;
        background-color: ${value};
        display: inline-block;
        margin-right: 8px;
        margin-bottom: -3px;
      }
    `}</style>
  </div>
);

const LayerLegend = ({ style, header, subheader, items }) => (
  <div>
    <Segment
      style={{
        position: "fixed",
        cursor: "default",
        right: 20,
        bottom: 110,
        zIndex: 1000,
        width: 160,
        ...style
      }}
    >
      <Header style={{ marginBottom: "0.2em" }}>{header}</Header>
      <Header as="h5" style={{ margin: 0 }}>
        {subheader}
      </Header>
      <List>
        {items.map(item => (
          <List.Item key={item.value} style={{ marginBottom: "3px" }}>
            <List.Content>
              <List.Header>
                <ColorBlock value={item.color} />
                {item.value}
              </List.Header>
            </List.Content>
          </List.Item>
        ))}
      </List>
    </Segment>
  </div>
);

export default LayerLegend;
