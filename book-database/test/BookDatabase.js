const BookDatabase = artifacts.require("BookDatabase");

contract("BookDatabase", function (accounts) {
  const bookTitle = "Test book";
  const bookYear = 2023;

  beforeEach(async () => {
    contract = await BookDatabase.new();
  });

  it("should get count = 0", async () => {
    const count = await contract.count();
    assert(count.toNumber() === 0, "Count is not '0'");
  });

  it("should add book", async () => {
    await contract.addBook({
      title: bookTitle,
      year: bookYear,
    });

    const count = await contract.count();
    assert(count.toNumber() === 1, "Count is not '1'");
  });

  it("should get book by id", async () => {
    await contract.addBook({
      title: bookTitle,
      year: bookYear,
    });

    const addedBook = await contract.books(1);
    assert(addedBook.title === bookTitle, "Failed to get book by id");
  });

  it("should edit book by id", async () => {
    await contract.addBook({
      title: bookTitle,
      year: bookYear,
    });

    await contract.editBook(1, {
      title: "",
      year: 2016,
    });

    const updatedBook = await contract.books(1);
    assert(
      updatedBook.year.toNumber() === 2016 && updatedBook.title === bookTitle,
      "Failed to edit book by id"
    );
  });

  it("should remove book by id", async () => {
    await contract.addBook({
      title: bookTitle,
      year: bookYear,
    });

    await contract.removeBook(1, { from: accounts[0] });

    const count = await contract.count();
    assert(count.toNumber() === 0, "Failed to remove book by id");
  });

  it("should NOT remove book by id (account is not the owner)", async () => {
    try {
      await contract.removeBook(1, { from: accounts[1] });
      assert.fail("The book was removed without permission");
    } catch (error) {
      assert.include(error.message, "revert", "The error should revert the transaction");
    }
  });
});
