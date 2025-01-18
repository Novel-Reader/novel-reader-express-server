import logger from "../../src/utils/logger";

describe("logger", () => {
  it("should log", () => {
    logger.info("this is a info log");
    logger.debug("this is a debug log");
    logger.warn("this is a warn log");
    logger.error("this is a error log");
    logger.fatal("this is a fatal log");
  });
});
