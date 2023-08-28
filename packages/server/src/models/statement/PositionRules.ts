import { ActionEntity } from "@models/action/action";
import { EntityEnums } from "@shared/enums";
import { IAction } from "@shared/types";

export class PositionRules {
  classes: EntityEnums.ExtendedClass[] = [];
  undefinedActions: string[] = [];
  allEmpty = true;
  mismatch = false;

  constructor(actions: IAction[], position: EntityEnums.Position) {
    for (const action of actions) {
      const rules = ActionEntity.toRules(action.data.entities)[position];
      if (!rules) {
        this.undefinedActions.push(action.id);
      }
      this.allEmpty = this.allEmpty && PositionRules.isRuleEmpty(rules);

      if (!this.mismatch) {
        if (this.classes.length) {
          this.mismatch = true;
          for (const rule of rules || []) {
            if (this.classes.indexOf(rule) !== -1) {
              this.mismatch = false;
              break;
            }
          }
        }
      }
      this.classes = this.classes.concat(rules || []);
    }
  }

  static isRuleEmpty(rules: EntityEnums.ExtendedClass[] | undefined): boolean {
    if (!rules) {
      return false;
    }

    return (
      !rules.length || !!rules.find((r) => r === EntityEnums.Extension.Empty)
    );
  }
}