import { useState, type FormEvent } from 'react';
import { Button, Field, Input, Stack } from '@chakra-ui/react';

import type { ISavedAnalysis } from '@shared/contracts/saved-analysis';

import { useAnalyzeWebsite } from '../hooks/use-analyze-website';
import { getAnalysisErrorMessage, isRetryableError } from '../lib/get-analysis-error-message';

interface IAnalyzeWebsiteFormProps {
  initialUrl?: string;
  onSuccess?: (analysis: ISavedAnalysis) => void;
}

export const AnalyzeWebsiteForm = ({ initialUrl = '', onSuccess }: IAnalyzeWebsiteFormProps) => {
  const [url, setUrl] = useState(initialUrl);
  const { mutate, reset, isPending, error } = useAnalyzeWebsite();

  const trimmedUrl = url.trim();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (trimmedUrl && !isPending) {
      mutate(trimmedUrl, { onSuccess });
    }
  };

  const handleChange = (value: string) => {
    setUrl(value);

    if (error) reset();
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Field.Root invalid={Boolean(error)}>
        <Field.Label srOnly>Website URL</Field.Label>

        <Stack direction={{ base: 'column', md: 'row' }} gap={3} w="full">
          <Input
            name="url"
            value={url}
            onChange={(event) => handleChange(event.target.value)}
            placeholder="https://example.com"
            disabled={isPending}
            autoComplete="url"
            inputMode="url"
          />

          <Button type="submit" loading={isPending} disabled={!trimmedUrl}>
            {error && isRetryableError(error) ? 'Try again' : 'Analyze website'}
          </Button>
        </Stack>

        {error && <Field.ErrorText>{getAnalysisErrorMessage(error)}</Field.ErrorText>}
      </Field.Root>
    </form>
  );
};
