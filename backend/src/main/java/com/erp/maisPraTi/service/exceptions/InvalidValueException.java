package com.erp.maisPraTi.service.exceptions;

public class InvalidValueException extends RuntimeException{
    public InvalidValueException(String message) {
        super(message);
    }
}