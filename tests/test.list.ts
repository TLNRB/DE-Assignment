import { test } from '@playwright/test';

// Tests
import { userResgister, userLogin } from './user.test';

test.describe(userResgister);
test.describe(userLogin);