原理很简单，就是将

```js
import { Select, Pagination, Button } from 'xxx-ui';
```

通过babel转化成
```js
import Button from `xxx-ui/src/components/ui-base/Button/Button`;
import Pagination from `xxx-ui/src/components/ui-base/Pagination/Pagination`;
import Select from `xxx-ui/src/components/ui-base/Select/Select`;
```
