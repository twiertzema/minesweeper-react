[minesweeper-react](../README.md) › [Globals](../globals.md) › ["lib/utils"](../modules/_lib_utils_.md) › [OutOfBoundsError](_lib_utils_.outofboundserror.md)

# Class: OutOfBoundsError

Indicates that the supplied coordinates are out of bounds for the given board.
Automatically supplies the error message of `"out of bounds:"`.

## Hierarchy

* [Error](_lib_utils_.invalidconfigerror.md#static-error)

  ↳ **OutOfBoundsError**

## Index

### Constructors

* [constructor](_lib_utils_.outofboundserror.md#constructor)

### Properties

* [message](_lib_utils_.outofboundserror.md#message)
* [name](_lib_utils_.outofboundserror.md#name)
* [stack](_lib_utils_.outofboundserror.md#optional-stack)
* [Error](_lib_utils_.outofboundserror.md#static-error)

## Constructors

###  constructor

\+ **new OutOfBoundsError**(`x`: number, `y`: number): *[OutOfBoundsError](_lib_utils_.outofboundserror.md)*

**Parameters:**

Name | Type |
------ | ------ |
`x` | number |
`y` | number |

**Returns:** *[OutOfBoundsError](_lib_utils_.outofboundserror.md)*

## Properties

###  message

• **message**: *string*

*Inherited from [InvalidConfigError](_lib_utils_.invalidconfigerror.md).[message](_lib_utils_.invalidconfigerror.md#message)*

___

###  name

• **name**: *string*

*Inherited from [InvalidConfigError](_lib_utils_.invalidconfigerror.md).[name](_lib_utils_.invalidconfigerror.md#name)*

___

### `Optional` stack

• **stack**? : *undefined | string*

*Inherited from [InvalidConfigError](_lib_utils_.invalidconfigerror.md).[stack](_lib_utils_.invalidconfigerror.md#optional-stack)*

___

### `Static` Error

▪ **Error**: *ErrorConstructor*
