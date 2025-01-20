import DBHelper from '../../src/utils/db-helper';

// need run server then test
describe("DBHelper", () => {
  it("should get user info with no params", (done) => {
    DBHelper("SELECT * FROM user", (err, rows) => {
      expect(err).toBeNull();
      expect(rows.length).toBeGreaterThan(-1);
      done();
    });
  });
  it("should get user info with vacant array params", (done) => {
    DBHelper("SELECT * FROM user", (err, rows) => {
      expect(err).toBeNull();
      expect(rows.length).toBeGreaterThan(-1);
      done();
    }, []);
  });
  it("should get user info with array params", (done) => {
    DBHelper("SELECT * FROM user where id = ?", (err, rows) => {
      expect(err).toBeNull();
      expect(rows.length).toBe(0);
      done();
    }, ['10000']);
  });
});
