import React from "react";
import { injectIntl } from "react-intl";
import {
  PublishedComponent,
  TextInput,
  NumberInput,
  SelectInput,
  CustomFilterTypeStatusPicker,
  CustomFilterFieldStatusPicker
} from "@openimis/fe-core";
import { Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import { connect } from "react-redux";
import { 
  BOOLEAN,
  INTEGER, 
  STRING, 
  CLEARED_STATE_FILTER, 
  DATE, 
  BOOL_OPTIONS 
} from "../constants";

const StyledGrid = styled(Grid)(({ theme }) => ({
  '& .item': theme.paper?.item ?? {},
  '& .criteriaRow': {
    width: '100%',
    margin: 0,
    backgroundColor: '#DFEDEF',
    alignItems: 'flex-end',
  },
  '& .removeCell': {
    width: '28px',
    minWidth: '28px',
    height: '100%',
    marginTop: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#006273',
    cursor: 'pointer',
    fontSize: '16px',
  },
  '& .fieldCell': {
    minWidth: '350px',
  },
  '& .filterCell': {
    minWidth: '350px',
  },
  '& .valueCell': {
    minWidth: '300px',
  },
  '& .amountCell': {
    minWidth: '240px',
  },
}));

const AdvancedCriteriaRowValue = ({
  customFilters,
  currentFilter,
  setCurrentFilter,
  index,
  filters,
  setFilters,
  readOnly,
}) => {

  const onAttributeChange = (attribute) => (value) => {
    let updatedFilter = { ...currentFilter };
  
    if (attribute === 'field') {
      updatedFilter = {
        ...{ filter: '', value: '', type: value.type, amount: '' },
      };
    }
  
    const attributeValue = attribute === 'field' ? value.field : value;
    updatedFilter = {
      ...updatedFilter,
      [attribute]: attributeValue,
      ...(attribute === 'filter' && { value: '' }),
    };
  
    setCurrentFilter(updatedFilter);
  
    setFilters((prevFilters) => {
      const updatedRows = [...prevFilters];
      updatedRows[index] = { ...updatedFilter };
      return updatedRows;
    });
  };

  const removeFilter = () => {
    const newArray = [...filters];
    newArray.splice(index, 1);
    setFilters(newArray.length === 0 ? [CLEARED_STATE_FILTER] : newArray);
  };

  const renderInputBasedOnType = (type) => {
    const commonProps = {
      module: "paymentPlan",
      label: "paymentPlan.advancedCriteria.value",
      value: currentFilter.value,
      onChange: onAttributeChange("value"),
      fullWidth: true,
    };
  
    switch (type) {
      case BOOLEAN:
        return (
          <SelectInput
            options={BOOL_OPTIONS}
            readOnly={readOnly}
            {...commonProps}
          />
        );
      case INTEGER:
        return (
          <NumberInput
            min={0}
            displayZero
            readOnly={readOnly}
            {...commonProps}
          />
        );
      case STRING:
      default:
        if (currentFilter.field.toLowerCase().includes(DATE)) {
          return (
            <PublishedComponent
              pubRef="core.DatePicker"
              readOnly={readOnly}
              {...commonProps}
            />
          );
        } else {
          return (
            <TextInput
              readOnly={readOnly}
              {...commonProps}
            />
          );
        }
    }
  };

  return (
    <StyledGrid 
      container 
      direction="row" 
      className="item criteriaRow"
      columnSpacing={2}
      rowSpacing={1}
    >
      {filters.length > 0 ? (
        <div className="removeCell" role="button" tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              removeFilter();
            }
          }}
        >
          <span
            onClick={removeFilter}
          >
            &#x2716;
          </span>
        </div> 
      ) : (<></>)
      }
      <Grid size={4} className="item fieldCell">
        <CustomFilterFieldStatusPicker
          module="paymentPlan"
          label="paymentPlan.advancedCriteria.field"
          value={{ field: currentFilter.field, type: currentFilter.type }}
          onChange={onAttributeChange("field")}
          customFilters={customFilters}
        />
      </Grid>
        {currentFilter.field !== "" ? (
          <Grid size={2} className="item filterCell">
            <CustomFilterTypeStatusPicker
              module="paymentPlan"
              label="paymentPlan.advancedCriteria.filter"
              value={currentFilter.filter}
              onChange={onAttributeChange("filter")}
              customFilters={customFilters}
              customFilterField={currentFilter.field}
            />
          </Grid>
        ) : (<></>) }
        {currentFilter.field !== "" && currentFilter.filter !== "" ? (
          <Grid size={4} className="item valueCell">
            {renderInputBasedOnType(currentFilter.type)}
          </Grid>
        ) : (<></>) }
        {currentFilter.field !== "" && currentFilter.filter !== "" && currentFilter.value !== "" ? (
          <Grid size={2} className="item amountCell">
            <NumberInput
              min={0}
              displayZero
              module="paymentPlan"
              label="paymentPlan.advancedCriteria.amount"
              value={currentFilter.amount}
              onChange={onAttributeChange("amount")}
              fullWidth
            />
          </Grid>
        ) : (<></>) }
    </StyledGrid>
  );
};

export { StyledGrid };
export default injectIntl(connect(null, null)(AdvancedCriteriaRowValue));
