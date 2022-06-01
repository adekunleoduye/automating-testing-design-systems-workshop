import React, { useState } from "react";

import CurrencyConverter from "./CurrencyConverter";

export default {
  title: "Components/CurrencyConverter",
  component: CurrencyConverter
};

const Template = (args) => {
  const [currencyList, setCurrencyList] = useState(["USD", "CAD"]);
  const [baseCurrency, setBaseCurrency] = useState("USD");

  return (
    <CurrencyConverter
      baseCurrency={baseCurrency}
      setBaseCurrency={setBaseCurrency}
      currencyList={currencyList}
      setCurrencyList={setCurrencyList}
      {...args}
    />
  );
};

export const Default = Template.bind({});

export const IsEditing = Template.bind({});

IsEditing.args = {
  editing: true
};

export const IsLoading = Template.bind({});

IsLoading.args = {
  loading: true
};

export const HasError = Template.bind({});

HasError.args = {
  error: true
};
