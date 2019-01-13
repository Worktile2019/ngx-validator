import { Injectable } from '@angular/core';
import { NgForm, AbstractControl, ValidationErrors } from '@angular/forms';
import { NgxValidatorLoader } from './validator-loader.service';
import { NgxValidatorConfig, Dictionary } from './validator.class';

@Injectable()
export class NgxFormValidatorService {
    private _ngForm: NgForm;

    private _formElement: HTMLElement;

    private _config: NgxValidatorConfig;

    // public errors: string[];

    // 记录所有元素的验证信息
    public validations: Dictionary<{
        hasError?: boolean;
        errorMessages?: string[];
    }> = {};

    private _getValidationFeedbackStrategy() {
        const strategy =
            (this._config && this._config.validationFeedbackStrategy) ||
            this.thyFormValidateLoader.validationFeedbackStrategy;
        if (!strategy) {
            throw new Error(`validation display strategy is null`);
        }
        return strategy;
    }

    private _getElement(name: string) {
        const element = this._formElement[name];
        if (element) {
            return element;
        } else {
            return this._formElement.querySelector(`[name='${name}']`);
        }
    }

    private _clearElementError(name: string) {
        if (this.validations[name] && this.validations[name].hasError) {
            this.validations[name].hasError = false;
            this.validations[name].errorMessages = [];
            this._getValidationFeedbackStrategy().removeError(this._getElement(name));
        }
    }

    private _tryGetValidation(name: string) {
        if (!this.validations[name]) {
            this._initializeFormControlValidation(name, this._ngForm.controls[name]);
        }
        return this.validations[name];
    }

    private _initializeFormControlValidation(name: string, control: AbstractControl) {
        this.validations[name] = {
            hasError: false,
            errorMessages: []
        };
        control.valueChanges.subscribe(() => {
            this._clearElementError(name);
        });
    }

    private _restFormControlValidation(name: string) {
        const validation = this.validations[name];
        if (validation) {
            validation.hasError = false;
            validation.errorMessages = [];
        }
    }

    private _getValidationMessage(name: string, validationError: string) {
        if (
            this._config &&
            this._config.validationMessages &&
            this._config.validationMessages[name] &&
            this._config.validationMessages[name][validationError]
        ) {
            return this._config.validationMessages[name][validationError];
        }
        return this.thyFormValidateLoader.getErrorMessage(name, validationError);
    }

    private _getValidationMessages(name: string, validationErrors: ValidationErrors) {
        const messages = [];
        for (const validationError in validationErrors) {
            if (validationErrors.hasOwnProperty(validationError)) {
                messages.push(this._getValidationMessage(name, validationError));
            }
        }
        return messages;
    }

    private _setControlValidationError(name: string, errorMessages: string[]) {
        const validation = this._tryGetValidation(name);
        validation.errorMessages = errorMessages;
        validation.hasError = true;
        this._getValidationFeedbackStrategy().showError(this._getElement(name), errorMessages);
    }

    constructor(private thyFormValidateLoader: NgxValidatorLoader) {}

    initialize(ngForm: NgForm, formElement: HTMLElement) {
        this._ngForm = ngForm;
        this._formElement = formElement;
    }

    setValidatorConfig(config: NgxValidatorConfig) {
        this._config = config;
    }

    validateControl(name: string) {
        this._clearElementError(name);
        const control = this._ngForm.controls[name];
        if (control && control.invalid) {
            const errorMessages = this._getValidationMessages(name, control.errors);
            this._setControlValidationError(name, errorMessages);
        }
    }

    validateControls() {
        // 主要是 无法检测到 ngForm 的 controls 的变化，或者是我没有找到
        // 验证的时候循环 ngForm 的 controls 验证
        // 发现没有 validation 初始化一个，已经存在不会重新初始化，保存缓存数据
        for (const name in this._ngForm.controls) {
            if (this._ngForm.controls.hasOwnProperty(name)) {
                this._tryGetValidation(name);
                this.validateControl(name);
            }
        }
        // 移除已经不存在的 validation
        const names = Object.keys(this.validations);
        names.forEach(name => {
            if (!this._ngForm.controls[name]) {
                delete this.validations[name];
            }
        });
    }

    validate($event?: Event): boolean {
        this._ngForm.onSubmit($event);
        this.validateControls();
        return this._ngForm.valid;
    }

    reset() {
        this._ngForm.reset();
        for (const name in this.validations) {
            if (this.validations.hasOwnProperty(name)) {
                this._restFormControlValidation(name);
                this._clearElementError(name);
            }
        }
    }

    setElementErrorMessage(name: string, message: string) {
        this._clearElementError(name);
        this._setControlValidationError(name, [message]);
    }
}
