/* eslint-disable react/jsx-no-bind */
import React, { useState, useEffect } from "react";
import cn from "classnames";
import { Button, InputGroup, FormControl, Form } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";

import { IoPencil, IoAddCircleSharp } from "react-icons/io5";
import { AiFillDelete } from "react-icons/ai";
import getSymbolFromCurrency from "currency-symbol-map";

import { BiError } from "react-icons/bi";
import CURRENCY_DATA from "./fixtures/rates.json";
import ISO from "./fixtures/iso.json";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-typeahead/css/Typeahead.css";
import styles from "./CurrencyConverter.module.scss";

import Loading from "../Loading";

const { rates: RATES, updated } = CURRENCY_DATA;

const getUpdatedDate = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  hour12: true,
  timeZone: "America/Los_Angeles"
}).format(updated * 1000);

function getNumericCode(currency, data = ISO) {
  const numericCode = data.find((iso) => iso["Alphabetic Code"] === currency);

  if (numericCode === null) return "No Results";
  // if (currency === "EUR") {
  //   return {
  //   currencyName: numericCode.Currency,
  //   numberCode: numericCode["Numeric Code"],
  //   currencyCode: numericCode["Alphabetic Code"]
  // };
  // }

  return {
    currencyName: numericCode.Currency,
    numberCode: numericCode["Numeric Code"],
    currencyCode: numericCode["Alphabetic Code"]
  };
}

export function CurrencyItem({
  currency,
  baseCurrency,
  setBaseValue,
  baseValue,
  isEditing,
  currencyList,
  setCurrencyList
}) {
  const { currencyName, numberCode, currencyCode } = getNumericCode(currency);

  const showDeleteButton = isEditing && currency !== baseCurrency;

  function handleChange(e) {
    setBaseValue(e.target.value);
  }

  return (
    <div
      className={cn(
        styles.currencyItem,
        showDeleteButton && styles.hasDeleteBtn
      )}
    >
      <div className={styles.flagWrapper}>
        <img
          className={styles.flag}
          src={`https://countryflagsapi.com/svg/${
            numberCode === 978 ? "EUR" : numberCode
          }`}
          alt=""
        />
      </div>
      <div className={styles.infoWrapper}>
        <div className={styles.nameShort}>{currency}</div>
        <div className={styles.nameLong}>{currencyName}</div>
      </div>
      <div className={styles.valueWrapper}>
        {currency === baseCurrency ? (
          <InputGroup className={cn(styles.currencyInput)}>
            <InputGroup.Text>
              {getSymbolFromCurrency(baseCurrency)}
            </InputGroup.Text>
            <FormControl
              aria-label="Amount (to the nearest dollar)"
              defaultValue={RATES[currency]}
              onChange={handleChange}
            />
          </InputGroup>
        ) : showDeleteButton ? null : (
          <>
            <div className={styles.currencyValue}>
              {getSymbolFromCurrency(currency)}{" "}
              {(RATES[currency] * baseValue).toFixed(2)}
            </div>
            <div className={styles.currencyConversion}>
              1 {baseCurrency} = {RATES[currency].toFixed(2)} {currency}
            </div>
          </>
        )}
      </div>
      {showDeleteButton && (
        <div>
          <Button
            variant="light"
            className={styles.editBtn}
            onClick={() =>
              setCurrencyList((prev) => {
                return prev.filter((item) => item !== currency);
              })
            }
          >
            <AiFillDelete className={styles.iconRemove} />{" "}
            <span className="screen-reader-text">Remove {currency}</span>
          </Button>
        </div>
      )}
    </div>
  );
}
// export function CurrencyItem({ countryCode, setBaseValue, baseValue }) {
//   const { currency, countryName, iso } = getAllInfoByISO(countryCode);
//   console.log(baseValue);

// function handleChange(e) {
//   setBaseValue(e.target.value);
// }

//   return (
{
  /* <div className={styles.currencyItem}>
  <div className={styles.flagWrapper}>
    <img
      className={styles.flag}
      src={`https://flagcdn.com/${iso.toLowerCase()}.svg`}
      alt="USA Flag"
    />
  </div>
  <div className={styles.infoWrapper}>
    <div className={styles.nameShort}>{currency}</div>
    <div className={styles.nameLong}>{countryName}</div>
  </div>
  <div className={styles.valueWrapper}>
    {currency === "USD" ? (
      <InputGroup className={cn(styles.currencyInput)}>
        <InputGroup.Text>$</InputGroup.Text>
        <FormControl
          aria-label="Amount (to the nearest dollar)"
          defaultValue={RATES[currency]}
          onChange={handleChange}
        />
      </InputGroup>
    ) : (
      <>
        <div className={styles.currencyValue}>
          {getSymbolFromCurrency("USD")}{" "}
          {(RATES[currency] * baseValue).toFixed(2)}
        </div>
        <div className={styles.currencyConversion}>
          1 USD = {RATES[currency]} {currency}
        </div>
      </>
    )}
  </div>
</div> */
}
//   );
// }

export default function CurrencyConverter({
  loading = false,
  error = false,
  currencyList,
  setCurrencyList,
  baseCurrency,
  setBaseCurrency,
  editing
}) {
  const [baseValue, setBaseValue] = useState(1);
  const [isAddingCurrency, setIsAddingCurrency] = useState(false);
  const [tempCurrenciesList, setTempCurrenciesList] = useState([]);
  const [allCurrencyCode, setAllCurrencyCode] = useState(Object.keys(RATES));
  const [isEditing, setIsEditing] = useState(editing);

  const typeaheadeRef = React.createRef();

  useEffect(() => {
    setAllCurrencyCode(
      Object.keys(RATES).filter((code) => !currencyList.includes(code))
    );
  }, [currencyList]);

  if (loading)
    return (
      <div className={cn(styles.root, styles.isLoading)}>
        <div className={cn(styles.stateContainer)}>
          <Loading />
          <p className="screen-reader-text">Loading</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className={cn(styles.root, styles.hasError)}>
        <div className={cn(styles.stateContainer)}>
          <BiError className={styles.iconError} />
          <p className="mt-3">
            Currency converter isn’t available. Please try again later.
          </p>
        </div>
      </div>
    );

  return (
    <div className={cn(styles.root)}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Currency Converter</h1>
          <span className={styles.date}>Updated: {getUpdatedDate}</span>
        </div>
        <div>
          {isEditing === false ? (
            <Button
              variant="secondary"
              className={styles.editBtn}
              onClick={() => {
                setIsEditing(true);
              }}
            >
              <IoPencil />{" "}
              <span className="screen-reader-text">Edit Currency List</span>
            </Button>
          ) : (
            <Button variant="primary" onClick={() => setIsEditing(false)}>
              Save <span className="screen-reader-text">Currency List</span>
            </Button>
          )}
        </div>
      </header>
      <div className={styles.CurrencyGroup} aria-label="currency list">
        {currencyList.map((countryCurrency) => {
          return (
            <CurrencyItem
              key={countryCurrency}
              currency={countryCurrency}
              baseValue={baseValue}
              setBaseValue={setBaseValue}
              baseCurrency={baseCurrency}
              isEditing={isEditing}
              currencyList={currencyList}
              setCurrencyList={setCurrencyList}
            />
          );
        })}
      </div>
      <footer className={cn(styles.footer, "d-grid", "gap-2")}>
        {isAddingCurrency === false ? (
          <Button
            variant="primary"
            className={styles.addCurrencyBtn}
            onClick={() => setIsAddingCurrency(true)}
            disabled={isEditing === true}
          >
            <span>
              <IoAddCircleSharp /> Add Currencies
            </span>
          </Button>
        ) : (
          <Form.Group>
            <Typeahead
              id="basic-typeahead-single"
              labelKey="currency search"
              options={allCurrencyCode}
              multiple
              placeholder="Add currencies..."
              ref={typeaheadeRef}
              onChange={(list) => {
                setTempCurrenciesList(list);
              }}
            />
            <div className={cn(styles.btnGroup)}>
              <Button
                variant="tertiary"
                className={styles.applyBtn}
                disabled={tempCurrenciesList.length === 0}
                onClick={() => {
                  typeaheadeRef.current.clear();
                  setIsAddingCurrency(false);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                className={styles.applyBtn}
                disabled={tempCurrenciesList.length === 0 || isEditing === true}
                onClick={() => {
                  setCurrencyList([...currencyList, ...tempCurrenciesList]);
                  setIsAddingCurrency(false);
                  typeaheadeRef.current.clear();
                }}
              >
                Apply
              </Button>
            </div>
          </Form.Group>
        )}
      </footer>
    </div>
  );
}
