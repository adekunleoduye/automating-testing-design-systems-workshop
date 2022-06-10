import { render, screen, waitFor } from "@testing-library/react";
import { Default, IsLoading, HasError } from "./CurrencyConverter.stories.js";
import userEvent from "@testing-library/user-event";

describe("Currency Converter", () => {
  it("should render", async () => {
    render(<Default />);

    const actual = await screen.findByText("Currency Converter");
    expect(actual).toBeTruthy();
  });
  it("should render loading state", () => {
    render(<IsLoading {...IsLoading.args} />);

    const actual = screen.getByText("Loading");
    expect(actual).toBeTruthy();
  });

  describe("When the user adds a currency", () => {
    it("currency should appear in the list", async () => {
      render(<Default />);
      const addBtn = screen.getByRole("button", { name: /add currencies/i });

      userEvent.click(addBtn);
      const input = screen.getByPlaceholderText("Add currencies...");

      expect(input).toBeInTheDocument();
      userEvent.type(input, "NGN");

      const currencyBtn = await screen.findByRole("option", { name: /NGN/i });
      await userEvent.click(currencyBtn);
      const applyBtn = await screen.findByRole("button", { name: /Apply/i });
      await userEvent.click(applyBtn);

      waitFor(() => expect(screen.getByText("Naira")).toBeInTheDocument());
    });
  });

  describe("When the user removes a currency", () => {
    it("currency should not appear in the list", async () => {
      render(<Default />);
      const currency = screen.getByText("CAD");
      expect(currency).toBeInTheDocument();

      const editBtn = screen.getByRole("button", {
        name: /Edit Currency List/i
      });
      await userEvent.click(editBtn);
      const deleteBtn = await screen.findByRole("button", {
        name: /Remove CAD/i
      });
      await userEvent.click(deleteBtn);
      const saveBtn = await screen.findByRole("button", { name: /Save /i });
      await userEvent.click(saveBtn);

      expect(currency).not.toBeInTheDocument();
    });
  });

  describe("When the rates are unavailable", () => {
    it("should render the error state", () => {
      render(<HasError {...HasError.args} />);

      const actual = screen.getByText(
        "Currency converter isn’t available. Please try again later."
      );
      expect(actual).toBeTruthy();
    });
  });
});
