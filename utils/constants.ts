export const shortPrompt = [
  '帮我生成一句王者荣耀的广告语',
  '生成一个王者荣耀广告视频的创意脚本',
  '用简单的术语解释量子计算',
  '如何创意的过一个 10 岁生日？',
  // '2023年的技术发展趋势',
  'ai领域的最新资讯',
  '如何训练一个chatgpt模型',
  '海外成熟的广告投放方案',
  '把你当成一个地道的美军士兵，用美军俚语或者军营黑话来说：“这个任务小菜一碟”，要求不是直译，而是俚语',
  // '把你自己当成一个地道的美国人，用地道的英语生成十条游戏Arena Breakout的slogan',
  '把你当成给游戏产品做增长的负责人，需要制定未来三年的战略规划',
  // '帮我生成一个表格，包括姓名、部门、职位、在职时间，你可以自由发挥表中的数值'
];
export const filters = [
  '默认',
  '周报',
  '行业报告',
  'ppt大纲',
  '列举',
  // "转化格式",
  '归纳',
  '代码',
  '故事',
  '语法纠正',
  '文生图',
  // "文档总结"
];
export const langs = [
  '中文',
  '英语',
  '法语',
  '西班牙语',
  '阿拉伯语',
  '俄语',
  '德语',
  '日语',
  '古希腊神话语',
  '甲骨文',
  '火星文',
];
export const formats = [
  'markdown',
  'text',
];
export const codeFormats = [
  'javascript',
  'html',
  'json',
  'python',
  'shell',
  'go',
  'php',
];

export const textToImageParams = (prompt: string) => ({
  enable_hr: false,
  denoising_strength: 0,
  firstphase_width: 0,
  firstphase_height: 0,
  hr_scale: 2,
  hr_upscaler: 'string',
  hr_second_pass_steps: 0,
  hr_resize_x: 0,
  hr_resize_y: 0,
  prompt,
  styles: ['string'],
  seed: -1,
  subseed: -1,
  subseed_strength: 0,
  seed_resize_from_h: -1,
  seed_resize_from_w: -1,
  sampler_name: '',
  batch_size: 1,
  n_iter: 1,
  steps: 50,
  cfg_scale: 7,
  width: 512,
  height: 512,
  restore_faces: false,
  tiling: false,
  do_not_save_samples: false,
  do_not_save_grid: false,
  negative_prompt: 'string',
  eta: 0,
  s_churn: 0,
  s_tmax: 0,
  s_tmin: 0,
  s_noise: 1,
  override_settings: {},
  override_settings_restore_afterwards: true,
  script_args: [],
  sampler_index: 'Euler',
  script_name: '',
  send_images: true,
  save_images: false,
  alwayson_scripts: {},
  controlnet_units: [{
    input_image: '',
    mask: '',
    module: 'none',
    model: 'None',
    weight: 1,
    resize_mode: 'Scale to Fit (Inner Fit)',
    lowvram: false,
    processor_res: 64,
    threshold_a: 64,
    threshold_b: 64,
    guidance: 1,
    guidance_start: 0,
    guidance_end: 1,
    guessmode: true,
  }],
});

export const createPromptMap = (
  lang: string,
  format: string,
  codeFormat: string,
  inputValue: string | undefined,
) => ({
  翻译: `请以${lang}输出回答`,
  // '默认': `请帮我回答以下问题`,
  列举: '请帮我罗列，不要重复',
  周报: `请对本周工作的进展、遇到的问题和解决方案、以及下周的工作计划进行记录和总结。
  周报是重要的沟通工具，请认真撰写，确保内容准确、清晰、具体。
  周报应包括本周的工作成果、遇到的问题及解决方案、下周的工作计划、以及需要领导关注的问题等内容。
  周报的撰写应该简明扼要，突出重点，避免冗长和重复。
  请在周报中提供足够的信息，让领导和同事了解你的工作进展和成果，以便更好地支持你的工作。
  请在周报中提供具体的数据和信息，如完成的任务数、Bug修复情况、用户反馈等，以便更好地评估工作进展和效果。
  周报是团队管理和协作的重要工具，请认真撰写，及时提交，并根据领导和同事的反馈进行改进和优化。`,
  // '转化格式': `请帮我将以下输入转化为${format}格式`,
  转化格式: `请以好看的${format}格式输出回答${format === 'markdown' ? '，带有标题层级段落等格式' : ''}`,
  代码: `请以${codeFormat}语言格式输出代码`,
  // '转化格式': `给我展示一份 我所提问内容的 ${format} 语法`,
  // '归纳': `请以10个点进行归纳`
  归纳: `请参考但不局限于这些要求输出归纳 1.这段话的主旨是什么？
  2.这段话在阐述什么问题？
  3.这段话的结论是什么？
  4.这段话提到了哪些关键点？
  5.总结起来，这段话想要表达的是什么？
  6.如果要用一句话来概括这段话，应该怎么说？
  7.这段话对于解决什么问题有什么启示或建议？`,
  行业报告: `请参考但不局限于这些要求输出${inputValue}行业报告 1.这个行业报告的主题是什么？
  2.报告的撰写目的是什么？
  3.报告内容包括哪些方面？
  4.报告提供了哪些有价值的信息？
  5.这个行业报告的结论是什么？
  6.这个行业报告对于这个行业的未来发展有何影响？
  在提问和回答上述问题后，您可以对报告的主题、目的、内容、价值等方面有一个较为全面的了解，并对于如何输出这份行业报告有一定的思路。输出行业报告时，可以按照以下步骤进行：

  1.对报告的内容进行梳理和归纳，明确报告的主题、结论等重要信息。
  2.确定报告的受众群体，分析他们的需求和关注点。
  3.选择合适的报告形式和展示方式，如报告文本、数据可视化等，以满足受众的需求。
  4.着重强调报告中的重要信息和结论，并提供相关证据和数据支持。
  5.最后，通过总结和归纳，对报告进行一个概括和总结，以便读者可以更好地理解和应用这份报告。`,
  ppt大纲: `请以 ${inputValue} 为主题输出ppt大纲`,
  语法纠正: '请帮我纠正语法',
});
