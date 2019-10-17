### Examples

**Loading**

Set the loading prop while your results are loading

```
import { SearchResults } from "blackbox-react";

<SearchResults loading />
```

**Error**

Set the error prop if there was an error loading the leaders

```
import { SearchResults } from "blackbox-react";

<SearchResults error />
```


**Empty**

If the no leaderboard items are passed in, an empty message will be shown

```
import { SearchResults } from "blackbox-react";

<SearchResults />
```

**Results**

Filled with SearchResults

```
import { SearchResults, SearchResult, Button } from "blackbox-react";

<SearchResults>
  <SearchResult
    cta='Support'
    image='http://placehold.it/100x100'
    title='Support Name'
    subtitle='Supporter Charity'>
    <Button tag='a' href='http://google.com'>Support</Button>
  </SearchResult>
  <SearchResult
    cta='Support'
    image='http://placehold.it/100x100'
    title='Support Name'
    subtitle='Supporter Charity'>
    <Button tag='a' href='http://google.com'>Support</Button>
  </SearchResult>
</SearchResults>
```

**Custom styles**

Apply a custom styles object to alter the look. Available elements are:

- `root`
- `state`
- `loading`
