### Examples

**Standard Use**

```
import { InputValidations } from "blackbox-react";

<InputValidations
  validations={[ 'Field is required' ]}
/>
```

**Custom styles**

Apply a custom styles object to alter the look. Available elements are:

- `root` - Label element
- `error` - Individual error strings

```
import { InputValidations } from "blackbox-react";

var styles = {
  error: {
    padding: '1em',
    backgroundColor: 'red',
    color: 'white'
  }
};

<InputValidations
  styles={styles}
  validations={[ 'Field is required' ]}
/>
```

**Treatments**

The following treatments in your project's traits will be applied:

- `inputValidations` -> `root`
- `inputValidation` -> `error`
