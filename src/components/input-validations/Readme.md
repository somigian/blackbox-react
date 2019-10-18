### Examples

**Standard Use**

```
import { InputValidations, RichText } from "blackbox-react";

<RichText>
  <InputValidations
    validations={[ 'Field is required' ]}
  />
</RichText>
```

**Custom styles**

Apply a custom styles object to alter the look. Available elements are:

- `root` - Label element
- `error` - Individual error strings

```
import { InputValidations, RichText } from "blackbox-react";

var styles = {
  error: {
    padding: '1em',
    backgroundColor: 'red',
    color: 'white'
  }
};

<RichText>
  <InputValidations
    styles={styles}
    validations={[ 'Field is required' ]}
  />
</RichText>
```

**Treatments**

The following treatments in your project's traits will be applied:

- `inputValidations` -> `root`
- `inputValidation` -> `error`
