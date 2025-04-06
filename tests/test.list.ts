import { test } from '@playwright/test';

// Tests
import { userResgister, userLogin, userLogout } from './user.test';
import { gameCreate, gameEdit, gameDelete } from './game.test';

test.describe(userResgister);
test.describe(userLogin);
test.describe(gameCreate);
test.describe(gameEdit);
test.describe(gameDelete);
test.describe(userLogout);