### Examples

**Standard Use**

```
import { SearchForm } from "blackbox-react";

<SearchForm onChange={(val) => alert(val)} />
```

**Expanded**

```
import { SearchForm } from "blackbox-react";

<SearchForm expanded onChange={(val) => alert(val)} />
```

**With Search Results**

```
import { SearchForm, SearchResults, SearchResult, Button } from "blackbox-react";

var supporters = [1, 2, 3];

<SearchForm onChange={(v) => alert('Search for ' + v)}>
  <SearchResults loading={!supporters.length}>
    {supporters.map((sup, i) => (
      <SearchResult
        key={i}
        image='http://placehold.it/250x250'
        title='Supporter Name'
        subtitle='Charity Name'>
        <Button>Support</Button>
      </SearchResult>
    ))}
  </SearchResults>
</SearchForm>
```

**Custom styles**

Apply a custom styles object to alter the look. Available elements are:

- `root`
- `form`
- `field`
- `input`
- `label`
- `results`
