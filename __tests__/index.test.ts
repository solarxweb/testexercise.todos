import { test, expect } from '@playwright/test';

test('seems like e2e test', async ({ page }) => {
  await page.goto('http://localhost:3000')

    //** check autoFocus 1 */
  await expect(page.getByPlaceholder('What needs to be done?')).toBeFocused();

  const defaultButton = page.locator('button', { hasText: 'All' });
  
  const buttonTakeIt = page.locator('button', { hasText: 'take it'});
  const buttonDone = page.locator('button', { hasText: 'done?'});

  await expect(defaultButton).toHaveClass('todo-btn selected');

  await page.getByPlaceholder('What needs to be done?').fill('create task');
  await page.getByPlaceholder('What needs to be done?').press('Enter');

  const task = page.locator('li', { hasText: 'create task' });
  
  await expect(task).toBeVisible();
  await expect(task).toHaveClass('todo-list__item inactive');

  await buttonTakeIt.click();

  await expect(task).toHaveClass('todo-list__item active');

  //** check autoFocus 2 */
  await page.getByPlaceholder('What needs to be done?').fill('create task2');
  await page.getByPlaceholder('What needs to be done?').press('Enter');

  const task2 = page.locator('li', { hasText: 'create task2' });
  const counter = page.locator('.todos-left');

  await expect(task2).toBeVisible();
  await expect(task2).toHaveClass('todo-list__item inactive');
  await expect(counter).toHaveText(/2/);

  const tasks = page.locator('li');
  await expect(tasks).toHaveCount(2);

  const btnWithActiveTasks = page.locator('button', { hasText: 'Active'});
  const btnWithCompletedTasks = page.locator('.todo-btn', { hasText: 'Completed'});

  btnWithActiveTasks.click();

  await expect(counter).toHaveText(/1/);

  await buttonDone.click();
  await btnWithCompletedTasks.click();

  await expect(counter).toHaveText(/1/);

  const resetBtn = page.locator('.reset-button');

  await resetBtn.click();

  await expect(counter).toHaveText(/0/);
});
