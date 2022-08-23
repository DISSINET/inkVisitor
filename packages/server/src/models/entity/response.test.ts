import "ts-jest";
import Statement, {
  StatementActant,
  StatementAction,
} from "@models/statement/statement";
import { ResponseEntityDetail } from "./response";
import { EntityEnums } from "@shared/enums";
import Prop, { PropSpec } from "@models/prop/prop";
import Entity from "./entity";
import { prepareStatement } from "@models/statement/statement.test";

describe("test ResponseEntityDetail.walkEntityProps", function () {
  const baseEntity = new Entity({ id: "1" });
  const childEntity = new Entity({ id: "2" });
  const linkedEntity = new Entity({
    id: "3",
    class: EntityEnums.Class.Statement,
  });
  const prop = new Prop({});
  prop.type = new PropSpec({});
  prop.type.entityId = baseEntity.id;
  prop.value = new PropSpec({});
  prop.value.entityId = baseEntity.id;

  const children = new Prop({});
  children.type = new PropSpec({});
  children.type.entityId = childEntity.id;
  children.value = new PropSpec({});
  children.value.entityId = childEntity.id;

  prop.children.push(children);
  linkedEntity.props.push(prop);

  describe("linked entry via prop.type & prop.value and another in child with the same setup", () => {
    const response = new ResponseEntityDetail(baseEntity);
    response.walkEntityProps(linkedEntity, linkedEntity.props);

    it("should add to usedInMetaProps from prop.type", () => {
      const foundInType = response.usedInMetaProps.find(
        (u) => u.originId === linkedEntity.id
      );
      expect(!!foundInType).toBeTruthy();
    });

    it("should add to usedInMetaProps from prop.value", () => {
      const foundInValue = response.usedInMetaProps.find(
        (u) => u.originId === linkedEntity.id
      );
      expect(!!foundInValue).toBeTruthy();
    });

    it("should add to entities map", () => {
      expect(!!response.entities[linkedEntity.id]).toBeTruthy();
    });

    it("should add to postponedEntities map", () => {
      const keys = Object.keys(response.postponedEntities);
      expect(keys).toEqual([prop.type.entityId]);
    });
  });

  describe("linked entry via prop.children[].type & prop.children[].value", () => {
    const response = new ResponseEntityDetail(childEntity);
    response.walkEntityProps(linkedEntity, linkedEntity.props);

    it("should add from prop.children[].type", () => {
      const foundInType = response.usedInMetaProps.find(
        (u) => u.originId === linkedEntity.id
      );
      expect(!!foundInType).toBeTruthy();
    });

    it("should add from prop.children[].value", () => {
      const foundInValue = response.usedInMetaProps.find(
        (u) => u.originId === linkedEntity.id
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
          u.position === EntityEnums.UsedInPosition.Action
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
          u.position === EntityEnums.UsedInPosition.Actant
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
          u.statement.id === statement1.id && u.position === EntityEnums.UsedInPosition.Tag
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
    statement1.data.actions[0].props[0].value.entityId = entity.id;

    response.walkStatementsDataProps([statement1]);

    it("should add entry to usedInStatementProps under Value position", () => {
      const foundEntry = response.usedInStatementProps.find(
        (u) => u.statementId === statement1.id
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
    statement1.data.actions[0].props[0].type.entityId = entity.id;

    response.walkStatementsDataProps([statement1]);

    it("should add entry to usedInStatementProps under Type position", () => {
      const foundEntry = response.usedInStatementProps.find(
        (u) => u.statementId === statement1.id
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
    statement1.data.actions[0].props[0].children[0].type.entityId = entity.id;

    response.walkStatementsDataProps([statement1]);

    it("should add entry to usedInStatementProps under Type position", () => {
      const foundEntry = response.usedInStatementProps.find(
        (u) => u.statementId === statement1.id
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
    statement1.data.actions[0].props[0].children[0].children[0].children[0].type.entityId =
      entity.id;

    response.walkStatementsDataProps([statement1]);

    it("should add entry to usedInStatementProps under Type position", () => {
      const foundEntry = response.usedInStatementProps.find(
        (u) => u.statementId === statement1.id
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
    statement1.data.actions[0].props[0].children[0].children[0].children[0].type.entityId =
      entity.id;
    statement2.data.actions[0].props[0].value.entityId = entity.id;

    response.walkStatementsDataProps([statement1, statement2]);

    it("should add first entry to usedInStatementProps under Type position", () => {
      const foundEntry = response.usedInStatementProps.find(
        (u) => u.statementId === statement1.id
      );
      expect(!!foundEntry).toBeTruthy();
    });

    it("should add second entry to usedInStatementProps under Value position", () => {
      const foundEntry = response.usedInStatementProps.find(
        (u) => u.statementId === statement2.id
      );
      expect(!!foundEntry).toBeTruthy();
    });

    it("should add both entries to entities map", () => {
      expect(!!response.entities[statement1.id]).toBeTruthy();
      expect(!!response.entities[statement2.id]).toBeTruthy();
    });
  });
});
