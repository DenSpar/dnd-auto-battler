export class Conditions {
  private _deafened = false; // оглохший
  private _frightened = false; // испуганный
  private _blinded = false; // ослепленный
  private _petrified = false; // окаменевшый
  private _poisoned = false; // отравленный
  private _charmed = false; // очарованный
  private _grappled = false; // схваченный
  private _unconscious = false; // бессознательный
  private _prone = false; // сбитый с ног
  private _restrained = false; // опутанный
  private _stunned = false; // ошеломденный
  private _paralyzed = false; // парализованный

  constructor() {}

  /** оглохший */
  get deafened(): boolean {
    return this._deafened;
  }
  /** оглохший */
  set deafened(value: boolean) {
    this._deafened = value;
  }

  /** испуганный */
  get frightened(): boolean {
    return this._frightened;
  }
  /** испуганный */
  set frightened(value: boolean) {
    this._frightened = value;
  }

  /** ослепленный */
  get blinded(): boolean {
    return this._blinded;
  }
  /** ослепленный */
  set blinded(value: boolean) {
    this._blinded = value;
  }

  /** окаменевшый */
  get petrified(): boolean {
    return this._petrified;
  }
  /** окаменевшый */
  set petrified(value: boolean) {
    this._petrified = value;
  }

  /** отравленный */
  get poisoned(): boolean {
    return this._poisoned;
  }
  /** отравленный */
  set poisoned(value: boolean) {
    this._poisoned = value;
  }

  /** очарованный */
  get charmed(): boolean {
    return this._charmed;
  }
  /** очарованный */
  set charmed(value: boolean) {
    this._charmed = value;
  }

  /** схваченный */
  get grappled(): boolean {
    return this._grappled;
  }
  /** схваченный */
  set grappled(value: boolean) {
    this._grappled = value;
  }

  /** бессознательный */
  get unconscious(): boolean {
    return this._unconscious;
  }
  /** бессознательный */
  set unconscious(value: boolean) {
    this._unconscious = value;
  }

  /** сбитый с ног */
  get prone(): boolean {
    return this._prone;
  }
  /** сбитый с ног */
  set prone(value: boolean) {
    this._prone = value;
  }

  /** опутанный */
  get restrained(): boolean {
    return this._restrained;
  }
  /** опутанный */
  set restrained(value: boolean) {
    this._restrained = value;
  }

  /** ошеломденный */
  get stunned(): boolean {
    return this._stunned;
  }
  /** ошеломденный */
  set stunned(value: boolean) {
    this._stunned = value;
  }

  /** парализованный */
  get paralyzed(): boolean {
    return this._paralyzed;
  }
  /** парализованный */
  set paralyzed(value: boolean) {
    this._paralyzed = value;
  }
}
