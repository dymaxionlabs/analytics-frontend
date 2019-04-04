import React from "react";

import {
  Button,
  TransitionablePortal,
  Segment,
  List,
  Image
} from "semantic-ui-react";
import { withNamespaces } from "../../i18n";

export const allLayers = [
  {
    key: "recent_construction",
    image: "/static/icons/recent.png",
    value: "recent_construction",
    categories: ["urban"]
  },
  {
    key: "roofs",
    image: "/static/icons/roofs.png",
    value: "roofs",
    categories: ["urban"]
  },
  {
    key: "pools",
    image: "/static/icons/pools.png",
    value: "pools",
    categories: ["urban"]
  },
  {
    key: "informal_settlements",
    image: "/static/icons/slums.png",
    value: "informal_settlements",
    categories: ["urban"]
  },
  {
    key: "roads",
    image: "/static/icons/roads.png",
    value: "roads",
    categories: ["urban"]
  },
  {
    key: "soil",
    image: "/static/icons/soil.png",
    value: "soil",
    categories: ["agri"]
  },
  {
    key: "floods",
    image: "/static/icons/flood.png",
    value: "floods",
    categories: ["agri"]
  },
  {
    key: "true_color",
    image: "/static/icons/sat.png",
    value: "true_color",
    categories: []
  },
  {
    key: "ndvi",
    image: "/static/icons/vi.png",
    value: "ndvi",
    categories: ["agri"]
  },
  {
    key: "crop_lots",
    image: "/static/icons/soil.png",
    value: "crop_lots",
    categories: ["agri"]
  }
];

class LayersMenu extends React.Component {
  _onClickLayer = (_event, layerKey) => {
    this.props.onToggleLayer(layerKey);
  };

  _layersByCategory(categoryId) {
    return allLayers.filter(layer => layer.categories.includes(categoryId));
  }

  render() {
    const { t, selectedLayers, availableLayers } = this.props;

    return (
      <div>
        <List selection relaxed>
          {availableLayers.map(opts => (
            <List.Item
              active={selectedLayers.includes(opts.key)}
              key={opts.key}
              onClick={e => this._onClickLayer(e, opts.key)}
            >
              <Image
                avatar
                src={opts.image}
                width={28}
                height={28}
                style={{ margin: "7px 9px 7px 0px" }}
              />
              <List.Content style={{ width: "85%" }}>
                <List.Header as="a">{t(opts.key + "_title")}</List.Header>
                <List.Description as="a">
                  {t(opts.key + "_desc")}
                </List.Description>
              </List.Content>
            </List.Item>
          ))}
        </List>
        <style jsx global>{`
          .ui.selection.list {
            width: 300px;
          }

          .ui.selection.list > .item {
            padding: 16px 16px;
            border-radius: 0;
          }

          .ui.selection.list.list > .item:hover,
          .ui.selection.list > .item:hover {
            background: rgba(0, 0, 0, 0.06);
          }

          .ui.selection.list > .item.active {
            background: rgba(0, 0, 0, 0.12);
          }

          .ui.list .list > .item .description,
          .ui.list > .item .description {
            color: #000;
          }

          .ui.list .list > .item a.header,
          .ui.list > .item a.header {
            font-size: 16px;
            color: #000 !important;
            margin-bottom: 5px;
          }

          .ui.list .list > .item:hover a.header,
          .ui.list > .item:hover a.header {
            color: #000 !important;
          }
        `}</style>
      </div>
    );
  }
}

class LayerSelector extends React.Component {
  state = { open: false };

  handleOpen = () => this.setState({ open: true });
  handleClose = () => this.setState({ open: false });

  handleToggleLayer = (event, layerKey) => {
    // FIXME Should close automatically if there is 0 or 1 selected layers only
    this.setState({ open: false });

    const { onToggleLayer } = this.props;
    if (onToggleLayer) {
      onToggleLayer(event, layerKey);
    }
  };

  render() {
    const { t, availableLayers, selectedLayers } = this.props;
    const { open } = this.state;

    // If availableLayers exists, filter all layers with it
    const layers = availableLayers
      ? allLayers.filter(layer => availableLayers.includes(layer.key))
      : allLayers;

    return (
      <div style={{ position: "absolute", bottom: -5, left: 10, zIndex: 1000 }}>
        <TransitionablePortal
          closeOnTriggerClick
          open={open}
          onOpen={this.handleOpen}
          onClose={this.handleClose}
          openOnTriggerClick
          transition={{ animation: "fade up" }}
          trigger={
            <Button
              className="controlButton"
              circular
              icon="osi"
              size="massive"
              color="blue"
            />
          }
        >
          <Segment
            style={{
              position: "fixed",
              left: 20,
              bottom: 105,
              zIndex: 1000,
              overflow: "auto",
              maxHeight: 300,
              padding: 0
            }}
          >
            <LayersMenu
              t={t}
              onToggleLayer={this.handleToggleLayer}
              availableLayers={layers}
              selectedLayers={selectedLayers}
            />
          </Segment>
        </TransitionablePortal>
      </div>
    );
  }
}

export default withNamespaces()(LayerSelector);
