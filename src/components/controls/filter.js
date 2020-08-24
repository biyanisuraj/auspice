import React from "react";
import { connect } from "react-redux";
import Select from "react-select/lib/Select";
import { controlsWidth, isValueValid } from "../../util/globals";
import { applyFilter } from "../../actions/tree";

@connect((state) => {
  return {
    activeFilters: state.controls.filters,
    totalStateCounts: state.tree.totalStateCounts
  };
})
class FilterData extends React.Component {
  constructor(props) {
    super(props);
  }

  getStyles() {
    return {
      base: {
        width: controlsWidth,
        marginBottom: 0,
        fontSize: 14
      }
    };
  }
  makeOptions = () => {
    const options = [];
    // for each filter, add relevant options to `options`
    Object.keys(this.props.activeFilters)
      .forEach((filterName) => {
        Array.from(this.props.totalStateCounts[filterName].keys())
          .filter((itemName) => isValueValid(itemName)) // remove invalid values present across the tree
          .filter((itemName) => !this.props.activeFilters[filterName].includes(itemName)) // remove already enabled filters
          .sort() // filters are sorted alphabetically - probably not necessary for a select component
          .forEach((itemName) => {
            options.push({
              label: `${filterName} -> ${itemName}`,
              value: [filterName, itemName]
            });
          });
      });
    return options;
  }
  selectionMade = (sel) => {
    this.props.dispatch(applyFilter("add", sel.value[0], sel.value[1]));
  }

  render() {
    const styles = this.getStyles();
    return (
      <div style={styles.base} id="selectColorBy">
        <Select
          name="selectColorBy"
          value={undefined}
          arrowRenderer={null}
          options={this.makeOptions()}
          clearable={false}
          searchable
          multi={false}
          onChange={this.selectionMade}
        />
      </div>
    );
  }
}

export default FilterData;
