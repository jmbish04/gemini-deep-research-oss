import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import type { SelectChangeEvent } from '@mui/material/Select';
import Select from '@mui/material/Select';
import { useTheme } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import type React from 'react';
import { memo, useCallback, useMemo, useState } from 'react';
import tones from '../../consts/tones';
import { useGlobalStore } from '../../stores/global';
import { useSettingStore } from '../../stores/setting';
import ModelSelect from './ModelSelect';
import SliderSetting from './SliderSetting';
import ToneInfoDialog from './ToneInfoDialog';

const SettingDialog = memo(function SettingDialog() {
  const { openSetting, setOpenSetting } = useGlobalStore();
  const {
    coreModel,
    taskModel,
    thinkingBudget,
    depth,
    wide,
    parallelSearch,
    reportTone,
    modelList,
    update,
  } = useSettingStore();

  const [toneInfoOpen, setToneInfoOpen] = useState(false);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // Memoize expensive computations
  const selectedTone = useMemo(() => tones.find(tone => tone.slug === reportTone), [reportTone]);

  // Memoized handlers to prevent unnecessary re-renders
  const handleClose = useCallback(() => {
    setOpenSetting(false);
  }, [setOpenSetting]);

  const handleCoreModelChange = useCallback(
    (e: SelectChangeEvent<string>) => {
      update({ coreModel: e.target.value });
    },
    [update]
  );

  const handleTaskModelChange = useCallback(
    (e: SelectChangeEvent<string>) => {
      update({ taskModel: e.target.value });
    },
    [update]
  );

  const handleToneChange = useCallback(
    (e: SelectChangeEvent<string>) => {
      update({ reportTone: e.target.value });
    },
    [update]
  );

  // const handleMinWordsChange = useCallback(
  //   (_: Event, newValue: number | number[]) => {
  //     update({ minWords: newValue as number });
  //   },
  //   [update]
  // );

  const handleThinkingBudgetChange = useCallback(
    (_: Event, newValue: number | number[]) => {
      update({ thinkingBudget: newValue as number });
    },
    [update]
  );

  const handleParallelSearchChange = useCallback(
    (_: Event, newValue: number | number[]) => {
      update({ parallelSearch: newValue as number });
    },
    [update]
  );

  const handleDepthChange = useCallback(
    (_: Event, newValue: number | number[]) => {
      update({ depth: newValue as number });
    },
    [update]
  );

  const handleWideChange = useCallback(
    (_: Event, newValue: number | number[]) => {
      update({ wide: newValue as number });
    },
    [update]
  );

  const handleToneInfoOpen = useCallback(() => {
    setToneInfoOpen(true);
  }, []);

  const handleToneInfoClose = useCallback(() => {
    setToneInfoOpen(false);
  }, []);

  return (
    <>
      <Dialog
        open={openSetting}
        maxWidth="md"
        fullWidth
        onClose={handleClose}
        fullScreen={fullScreen}
        scroll="paper"
      >
        <DialogTitle sx={{ pb: { xs: 0.5, sm: 1 }, pr: { xs: 2, sm: 3 }, pl: { xs: 2, sm: 3 } }}>
          <Typography variant="h5" component="div">
            Research Settings
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ px: { xs: 2, sm: 3 }, py: { xs: 1.5, sm: 2 } }} dividers>
          <DialogContentText sx={{ mb: { xs: 2, sm: 3 } }}>
            Configure your research parameters and AI models. All settings are saved locally in your
            browser.
          </DialogContentText>

          {/* Model Selection Section */}
          <Box sx={{ mb: { xs: 3, sm: 4 } }}>
            <Typography
              variant="h6"
              color="primary"
              gutterBottom
              sx={{ mb: { xs: 1.5, sm: 2 }, display: 'flex', alignItems: 'center' }}
            >
              🤖 Model Configuration
            </Typography>

            {/* Models */}
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                mb: { xs: 1.5, sm: 2 },
                flexDirection: { xs: 'column', sm: 'row' },
              }}
            >
              <Box sx={{ flex: 1 }}>
                <ModelSelect
                  label="Core Model"
                  value={coreModel}
                  onChange={handleCoreModelChange}
                  modelList={modelList}
                  disabled={false}
                  modelsDisabled={false}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <ModelSelect
                  label="Task Model"
                  value={taskModel}
                  onChange={handleTaskModelChange}
                  modelList={modelList}
                  disabled={false}
                  modelsDisabled={false}
                />
              </Box>
            </Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mb: { xs: 1, sm: 2 }, display: { xs: 'none', sm: 'block' } }}
            >
              Models are provided through the Cloudflare AI Gateway. Mix and match providers and
              models for research and tasks.
            </Typography>
          </Box>

          <Divider sx={{ my: { xs: 2, sm: 3 } }} />

          {/* Research Parameters Section */}
          <Box sx={{ mb: { xs: 3, sm: 4 } }}>
            <Typography
              variant="h6"
              color="primary"
              gutterBottom
              sx={{ mb: { xs: 1.5, sm: 2 }, display: 'flex', alignItems: 'center' }}
            >
              🔬 Research Parameters
            </Typography>

            {/* Report Tone */}
            <Box sx={{ mb: { xs: 2, sm: 3 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  Writing Style
                </Typography>
                <Tooltip title="Click to see all available styles and their descriptions">
                  <IconButton size="small" onClick={handleToneInfoOpen} sx={{ ml: 1 }}>
                    <HelpOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <FormControl fullWidth size="small">
                <Select
                  value={reportTone}
                  onChange={handleToneChange}
                  renderValue={selected => (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Chip
                        label={selectedTone?.name || selected}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </Box>
                  )}
                >
                  {tones.map(tone => (
                    <MenuItem key={tone.slug} value={tone.slug}>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {tone.name}
                        </Typography>
                        {/* <Typography variant="caption" color="text.secondary" className='line-clamp-1 max-w-md'>
                          {tone.describe}
                        </Typography> */}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {selectedTone && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 1, display: { xs: 'none', sm: 'block' } }}
                >
                  {selectedTone.describe}
                </Typography>
              )}
            </Box>

            {/* Min Words */}
            {/* <Box sx={{ mb: { xs: 2, sm: 3 } }}>
              <SliderSetting
                label="Minimum Words"
                value={minWords}
                onChange={handleMinWordsChange}
                min={500}
                max={10000}
                step={500}
                formatLabel={value => value.toLocaleString()}
                description="The expected length of the report will be indicated by a system prompt, but the final length may vary."
                marks={[
                  { value: 1000, label: '1K' },
                  { value: 5000, label: '5K' },
                  { value: 10000, label: '10K' },
                ]}
              />
            </Box> */}

            {/* Advanced Parameters - Two Column Layout with Proper Label Containment */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: { xs: 2, sm: 4 },
                rowGap: { xs: 2, sm: 3 },
              }}
            >
              {/* Thinking Budget */}
              <SliderSetting
                label="Thinking Budget"
                value={thinkingBudget}
                onChange={handleThinkingBudgetChange}
                min={1024}
                max={16384}
                step={1024}
                formatLabel={value => value.toLocaleString()}
                description="This is the maximum number of tokens that the AI can use for internal reasoning before generating the final response."
                marks={[
                  { value: 1024, label: '1K' },
                  { value: 8192, label: '8K' },
                  { value: 16384, label: '16K' },
                ]}
              />

              {/* Parallel Search */}
              <SliderSetting
                label="Parallel Search"
                value={parallelSearch}
                onChange={handleParallelSearchChange}
                min={1}
                max={5}
                step={1}
                description="The number of simultaneous search queries executed in parallel to speed up the gathering of information."
                marks={[
                  { value: 1, label: 'Sequential' },
                  { value: 3, label: 'Moderate' },
                  { value: 5, label: 'Maximum' },
                ]}
              />

              {/* Research Depth */}
              <SliderSetting
                label="Research Depth"
                value={depth}
                onChange={handleDepthChange}
                min={2}
                max={8}
                step={1}
                description="What is the ideal number of research rounds to ensure a thorough coverage of a query? First, go broad. Then, go deep."
                marks={[
                  { value: 2, label: 'Light' },
                  { value: 3, label: 'Medium' },
                  { value: 5, label: 'Deep' },
                  { value: 8, label: 'Exhaustive' },
                ]}
              />

              {/* Research Width */}
              <SliderSetting
                label="Research Width"
                value={wide}
                onChange={handleWideChange}
                min={2}
                max={10}
                step={1}
                descriptionNode={
                  <>
                    What is the ideal number of distinct sources to consult{' '}
                    <span className="font-semibold">in each round</span> to ensure a broad
                    understanding of a query?
                  </>
                }
                marks={[
                  { value: 2, label: 'Focused' },
                  { value: 6, label: 'Balanced' },
                  { value: 10, label: 'Broad' },
                ]}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: { xs: 2, sm: 3 }, py: { xs: 1, sm: 2 } }}>
          <Button onClick={handleClose} variant="outlined" size="medium">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <ToneInfoDialog open={toneInfoOpen} onClose={handleToneInfoClose} />
    </>
  );
});

export default SettingDialog;
