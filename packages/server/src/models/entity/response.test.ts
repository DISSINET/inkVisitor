import "ts-jest";
import Statement, {
  StatementActant,
  StatementAction,
} from "@models/statement/statement";
import { ResponseEntityDetail } from "./response";
import { UsedInPosition } from "@shared/enums";
import Entity from "./entity";
import { prepareStatement } from "@models/statement/statement.test";
import { prepareEntity } from "./entity.test";

describe("test ResponseEntityDetail.walkEntityProps", function () {
  const [baseId, baseEntity] = prepareEntity();
  const [childId, childEntity] = prepareEntity();
  const [, linkedEntity] = prepareStatement();
  linkedEntity.props[0].type.id = baseId;
  linkedEntity.props[0].value.id = baseId;
  linkedEntity.props[0].children[0].type.id = childId;
  linkedEntity.props[0].children[0].value.id = childId;

  describe("linked entry via prop.type & prop.value and another in child with the same setup", () => {
    const response = new ResponseEntityDetail(baseEntity);
    response.walkEntityProps(linkedEntity, linkedEntity.props);

    it("should add to usedInMetaProps from prop.type", () => {
      const foundInType = response.usedInMetaProps.find(
        (u) =>
          u.entityId === linkedEntity.id && u.position === UsedInPosition.Type
      );
      expect(!!foundInType).toBeTruthy();
    });

    it("should add to usedInMetaProps from prop.value", () => {
      const foundInValue = response.usedInMetaProps.find(
        (u) =>
          u.entityId === linkedEntity.id && u.position === UsedInPosition.Value
      );
      expect(!!foundInValue).toBeTruthy();
    });

    it("should add to entities map", () => {
      expect(!!response.entities[linkedEntity.id]).toBeTruthy();
    });
  });

  describe("linked entry via prop.children[].type & prop.children[].value", () => {
    const response = new ResponseEntityDetail(childEntity);
    response.walkEntityProps(linkedEntity, linkedEntity.props);

    it("should add from prop.children[].type", () => {
      const foundInType = response.usedInMetaProps.find(
        (u) =>
          u.entityId === linkedEntity.id && u.position === UsedInPosition.Type
      );
      expect(!!foundInType).toBeTruthy();
    });

    it("should add from prop.children[].value", () => {
      const foundInValue = response.usedInMetaProps.find(
        (u) =>
          u.entityId === linkedEntity.id && u.position === UsedInPosition.Value
      );
      expect(!!foundInValue).toBeTruthy();
    });

    it("should add to entities map", () => {
      expect(!!response.entities[linkedEntity.id]).toBeTruthy();
    });
  });
});

describe("test ResponseEntityDetail.walkStatementsDataEntities", function () {
  const entity = new Entity({ id: "1" });

  describe("linked via actions.action", () => {
    const response = new ResponseEntityDetail(entity);
    const statement1 = new Statement({ id: "2" });
    statement1.data.actions.push(new StatementAction({ action: entity.id }));

    response.walkStatementsDataEntities([statement1]);

    it("should add entry to usedInStatement under Action position", () => {
      const foundEntry = response.usedInStatement.find(
        (u) =>
          u.statement.id === statement1.id &&
          u.position === UsedInPosition.Action
      );
      expect(!!foundEntry).toBeTruthy();
    });

    it("should add entry to entities map", () => {
      expect(!!response.entities[statement1.id]).toBeTruthy();
    });
  });

  describe("linked via actants.actant", () => {
    const response = new ResponseEntityDetail(entity);
    const statement1 = new Statement({ id: "2" });
    statement1.data.actants.push(new StatementActant({ actant: entity.id }));

    response.walkStatementsDataEntities([statement1]);

    it("should add entry to usedInStatement under Actant position", () => {
      const foundEntry = response.usedInStatement.find(
        (u) =>
          u.statement.id === statement1.id &&
          u.position === UsedInPosition.Actant
      );
      expect(!!foundEntry).toBeTruthy();
    });

    it("should add entry to entities map", () => {
      expect(!!response.entities[statement1.id]).toBeTruthy();
    });
  });

  describe("linked via tag", () => {
    const response = new ResponseEntityDetail(entity);
    const statement1 = new Statement({ id: "2" });
    statement1.data.tags.push(entity.id);

    response.walkStatementsDataEntities([statement1]);

    it("should add entry to usedInStatement under Tag position", () => {
      const foundEntry = response.usedInStatement.find(
        (u) =>
          u.statement.id === statement1.id && u.position === UsedInPosition.Tag
      );
      expect(!!foundEntry).toBeTruthy();
    });

    it("should add entry to entities map", () => {
      expect(!!response.entities[statement1.id]).toBeTruthy();
    });
  });
});

describe("test ResponseEntityDetail.walkStatementsDataProps", function () {
  const entity = new Entity({ id: "1" });

  describe("linked via actions.props.value", () => {
    const [, statement1] = prepareStatement();
    const response = new ResponseEntityDetail(entity);
    statement1.data.actions[0].props[0].value.id = entity.id;

    response.walkStatementsDataProps([statement1]);

    it("should add entry to usedInStatementProps under Value position", () => {
      const foundEntry = response.usedInStatementProps.find(
        (u) =>
          u.statement.id === statement1.id &&
          u.position === UsedInPosition.Value
      );
      expect(!!foundEntry).toBeTruthy();
    });

    it("should add entry to entities map", () => {
      expect(!!response.entities[statement1.id]).toBeTruthy();
    });
  });

  describe("linked via actions.props.type", () => {
    const [, statement1] = prepareStatement();
    const response = new ResponseEntityDetail(entity);
    statement1.data.actions[0].props[0].type.id = entity.id;

    response.walkStatementsDataProps([statement1]);

    it("should add entry to usedInStatementProps under Type position", () => {
      const foundEntry = response.usedInStatementProps.find(
        (u) =>
          u.statement.id === statement1.id && u.position === UsedInPosition.Type
      );
      expect(!!foundEntry).toBeTruthy();
    });

    it("should add entry to entities map", () => {
      expect(!!response.entities[statement1.id]).toBeTruthy();
    });
  });

  describe("linked via actions.props.type in 1st lvl", () => {
    const [, statement1] = prepareStatement();
    const response = new ResponseEntityDetail(entity);
    statement1.data.actions[0].props[0].children[0].type.id = entity.id;

    response.walkStatementsDataProps([statement1]);

    it("should add entry to usedInStatementProps under Type position", () => {
      const foundEntry = response.usedInStatementProps.find(
        (u) =>
          u.statement.id === statement1.id && u.position === UsedInPosition.Type
      );
      expect(!!foundEntry).toBeTruthy();
    });

    it("should add entry to entities map", () => {
      expect(!!response.entities[statement1.id]).toBeTruthy();
    });
  });

  describe("linked via actions.props.type in 3rd lvl", () => {
    const [, statement1] = prepareStatement();
    const response = new ResponseEntityDetail(entity);
    statement1.data.actions[0].props[0].children[0].children[0].children[0].type.id =
      entity.id;

    response.walkStatementsDataProps([statement1]);

    it("should add entry to usedInStatementProps under Type position", () => {
      const foundEntry = response.usedInStatementProps.find(
        (u) =>
          u.statement.id === statement1.id && u.position === UsedInPosition.Type
      );
      expect(!!foundEntry).toBeTruthy();
    });

    it("should add entry to entities map", () => {
      expect(!!response.entities[statement1.id]).toBeTruthy();
    });
  });

  describe("linked via actions.props.type in 3rd lvl and second linked via actions.props.value", () => {
    const [, statement1] = prepareStatement();
    const [, statement2] = prepareStatement();

    const response = new ResponseEntityDetail(entity);
    statement1.data.actions[0].props[0].children[0].children[0].children[0].type.id =
      entity.id;
    statement2.data.actions[0].props[0].value.id = entity.id;

    response.walkStatementsDataProps([statement1, statement2]);

    it("should add first entry to usedInStatementProps under Type position", () => {
      const foundEntry = response.usedInStatementProps.find(
        (u) =>
          u.statement.id === statement1.id && u.position === UsedInPosition.Type
      );
      expect(!!foundEntry).toBeTruthy();
    });

    it("should add second entry to usedInStatementProps under Value position", () => {
      const foundEntry = response.usedInStatementProps.find(
        (u) =>
          u.statement.id === statement2.id &&
          u.position === UsedInPosition.Value
      );
      expect(!!foundEntry).toBeTruthy();
    });

    it("should add both entries to entities map", () => {
      expect(!!response.entities[statement1.id]).toBeTruthy();
      expect(!!response.entities[statement2.id]).toBeTruthy();
    });
  });
});

describe("test ResponseEntityDetail.prepare", function () {
  const entity = new Entity({ id: "1" });

  describe("linked via actions.props.value", () => {
    const [, statement1] = prepareStatement();
    const response = new ResponseEntityDetail(entity);
    statement1.data.actions[0].props[0].value.id = entity.id;

    response.walkStatementsDataProps([statement1]);

    it("should add entry to usedInStatementProps under Value position", () => {
      const foundEntry = response.usedInStatementProps.find(
        (u) =>
          u.statement.id === statement1.id &&
          u.position === UsedInPosition.Value
      );
      expect(!!foundEntry).toBeTruthy();
    });

    it("should add entry to entities map", () => {
      expect(!!response.entities[statement1.id]).toBeTruthy();
    });
  });

  describe("linked via actions.props.type", () => {
    const [, statement1] = prepareStatement();
    const response = new ResponseEntityDetail(entity);
    statement1.data.actions[0].props[0].type.id = entity.id;

    response.walkStatementsDataProps([statement1]);

    it("should add entry to usedInStatementProps under Type position", () => {
      const foundEntry = response.usedInStatementProps.find(
        (u) =>
          u.statement.id === statement1.id && u.position === UsedInPosition.Type
      );
      expect(!!foundEntry).toBeTruthy();
    });

    it("should add entry to entities map", () => {
      expect(!!response.entities[statement1.id]).toBeTruthy();
    });
  });

  describe("linked via actions.props.type in 1st lvl", () => {
    const [, statement1] = prepareStatement();
    const response = new ResponseEntityDetail(entity);
    statement1.data.actions[0].props[0].children[0].type.id = entity.id;

    response.walkStatementsDataProps([statement1]);

    it("should add entry to usedInStatementProps under Type position", () => {
      const foundEntry = response.usedInStatementProps.find(
        (u) =>
          u.statement.id === statement1.id && u.position === UsedInPosition.Type
      );
      expect(!!foundEntry).toBeTruthy();
    });

    it("should add entry to entities map", () => {
      expect(!!response.entities[statement1.id]).toBeTruthy();
    });
  });

  describe("linked via actions.props.type in 3rd lvl", () => {
    const [, statement1] = prepareStatement();
    const response = new ResponseEntityDetail(entity);
    statement1.data.actions[0].props[0].children[0].children[0].children[0].type.id =
      entity.id;

    response.walkStatementsDataProps([statement1]);

    it("should add entry to usedInStatementProps under Type position", () => {
      const foundEntry = response.usedInStatementProps.find(
        (u) =>
          u.statement.id === statement1.id && u.position === UsedInPosition.Type
      );
      expect(!!foundEntry).toBeTruthy();
    });

    it("should add entry to entities map", () => {
      expect(!!response.entities[statement1.id]).toBeTruthy();
    });
  });

  describe("linked via actions.props.type in 3rd lvl and second linked via actions.props.value", () => {
    const [, statement1] = prepareStatement();
    const [, statement2] = prepareStatement();

    const response = new ResponseEntityDetail(entity);
    statement1.data.actions[0].props[0].children[0].children[0].children[0].type.id =
      entity.id;
    statement2.data.actions[0].props[0].value.id = entity.id;

    response.walkStatementsDataProps([statement1, statement2]);

    it("should add first entry to usedInStatementProps under Type position", () => {
      const foundEntry = response.usedInStatementProps.find(
        (u) =>
          u.statement.id === statement1.id && u.position === UsedInPosition.Type
      );
      expect(!!foundEntry).toBeTruthy();
    });

    it("should add second entry to usedInStatementProps under Value position", () => {
      const foundEntry = response.usedInStatementProps.find(
        (u) =>
          u.statement.id === statement2.id &&
          u.position === UsedInPosition.Value
      );
      expect(!!foundEntry).toBeTruthy();
    });

    it("should add both entries to entities map", () => {
      expect(!!response.entities[statement1.id]).toBeTruthy();
      expect(!!response.entities[statement2.id]).toBeTruthy();
    });
  });
});
