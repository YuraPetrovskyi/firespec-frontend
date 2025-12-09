"use client";

import { useState, useEffect } from "react";
import { inspectionSchema } from "@/config/inspectionSchema";

interface ProjectInformationSectionProps {
  data: any;
  onChange: (data: any) => void;
}

export default function ProjectInformationSection({
  data,
  onChange,
}: ProjectInformationSectionProps) {
  const [errors, setErrors] = useState<{ [key: string]: string | undefined }>(
    {}
  );
  const [customInputs, setCustomInputs] = useState<{ [key: string]: string }>(
    {}
  );
  const [showCustomInput, setShowCustomInput] = useState<{
    [key: string]: boolean;
  }>({});
  const [expandedDropdowns, setExpandedDropdowns] = useState<{
    [key: string]: boolean;
  }>({});

  // 🆕 Зберігаємо custom опції окремо для кожного поля
  const [customOptions, setCustomOptions] = useState<{
    [key: string]: string[];
  }>({});

  // 🆕 Автоматично відновлюємо custom опції з існуючих даних (тільки один раз при завантаженні)
  useEffect(() => {
    const discoveredCustomOptions: { [key: string]: string[] } = {};

    // Проходимо по всіх полях з опціями
    inspectionSchema.projectInformation
      .filter((field) => field.options && field.options.length > 0)
      .forEach((field) => {
        const fieldName = field.name;
        const standardOptions = field.options || [];
        const currentValues = data[fieldName] || [];

        // Перетворюємо на масив, якщо потрібно
        const valuesArray = Array.isArray(currentValues)
          ? currentValues
          : currentValues
          ? [String(currentValues)]
          : [];

        // Знаходимо custom опції (які не є в стандартному списку)
        const customValues = valuesArray.filter(
          (value) =>
            !standardOptions.includes(value) &&
            typeof value === "string" &&
            value.trim() !== ""
        );

        if (customValues.length > 0) {
          discoveredCustomOptions[fieldName] = customValues;
        }
      });

    // Оновлюємо стан custom опцій тільки якщо вони ще не були встановлені
    setCustomOptions((prev) => {
      const hasExistingOptions = Object.keys(prev).length > 0;
      if (hasExistingOptions) {
        // Якщо вже є custom опції, додаємо тільки нові (merge)
        const merged = { ...prev };
        Object.keys(discoveredCustomOptions).forEach((fieldName) => {
          const existing = merged[fieldName] || [];
          const discovered = discoveredCustomOptions[fieldName] || [];
          // Об'єднуємо, уникаючи дублікатів
          merged[fieldName] = [...new Set([...existing, ...discovered])];
        });
        return merged;
      } else {
        // Перший раз встановлюємо
        return discoveredCustomOptions;
      }
    });
  }, []); // 🆕 Видаляємо залежність від data - викликається тільки при монтуванні

  const handleChange = (field: string, value: any) => {
    onChange({
      ...data,
      [field]: field === "digital_recording" ? Number(value) : value,
    });
    console.log("store data:", data);
    if (field === "project_name" && value.trim() === "") {
      setErrors((prev) => ({
        ...prev,
        project_name: "Project name is required",
      }));
    } else {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Перемикання видимості dropdown
  const toggleDropdown = (fieldName: string) => {
    setExpandedDropdowns((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  };

  // Обробка multi-select полів
  const handleMultiSelectChange = (
    fieldName: string,
    optionValue: string,
    checked: boolean
  ) => {
    const currentValues = data[fieldName] || [];

    const valuesArray = Array.isArray(currentValues)
      ? currentValues
      : currentValues
      ? [String(currentValues)]
      : [];

    if (checked) {
      handleChange(fieldName, [...valuesArray, optionValue]);
    } else {
      handleChange(
        fieldName,
        valuesArray.filter((v) => v !== optionValue)
      );
      // 🆕 НЕ видаляємо опцію з customOptions при знятті галочки
    }
  };

  // 🆕 Покращене додавання custom опції
  const handleAddCustomOption = (fieldName: string) => {
    const customValue = customInputs[fieldName]?.trim();
    if (!customValue) return;

    const customOption = `${customValue}`;

    // Перевіряємо існуючі custom опції
    const existingCustomOptions = customOptions[fieldName] || [];
    const standardOptions =
      inspectionSchema.projectInformation.find(
        (field) => field.name === fieldName
      )?.options || [];

    // Перевіряємо, чи опція вже існує
    const alreadyExists =
      existingCustomOptions.includes(customOption) ||
      standardOptions.includes(customOption);

    if (!alreadyExists) {
      // 🆕 Додаємо нову custom опцію до списку (постійно зберігається)
      setCustomOptions((prev) => ({
        ...prev,
        [fieldName]: [...existingCustomOptions, customOption],
      }));
    }

    // Автоматично вибираємо опцію
    const currentValues = data[fieldName] || [];
    const valuesArray = Array.isArray(currentValues)
      ? currentValues
      : [currentValues].filter(Boolean);
    if (!valuesArray.includes(customOption)) {
      handleChange(fieldName, [...valuesArray, customOption]);
    }

    // Очищуємо input і ховаємо форму
    setCustomInputs((prev) => ({ ...prev, [fieldName]: "" }));
    setShowCustomInput((prev) => ({ ...prev, [fieldName]: false }));
  };

  const renderField = (field: any) => {
    const { name, label, type, options } = field;

    // Спеціальний випадок для digital_recording
    if (name === "digital_recording") {
      return (
        <select
          value={String(data[name] ?? 0)}
          onChange={(e) => handleChange(name, e.target.value)}
          className="border p-2 rounded bg-slate-50 font-extrabold text-gray-500"
        >
          <option value="1">✅ Yes</option>
          <option value="0">❌ No</option>
        </select>
      );
    }

    // Multi-select dropdown поля (згорнуті за замовчуванням)
    if (options && options.length > 0) {
      const currentValues = data[name] || [];
      const valuesArray = Array.isArray(currentValues)
        ? currentValues
        : [currentValues].filter(Boolean);
      const isExpanded = expandedDropdowns[name] || false;

      return (
        <div className="space-y-2">
          {/* Кнопка розгортання з preview вибраних значень */}
          <div
            onClick={() => toggleDropdown(name)}
            className="border rounded-lg p-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                {valuesArray.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    <span className="text-xs text-gray-600">Selected:</span>
                    {valuesArray.slice(0, 3).map((value, idx) => (
                      <span
                        key={idx}
                        className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                      >
                        {value.length > 15
                          ? `${value.substring(0, 15)}...`
                          : value}
                      </span>
                    ))}
                    {valuesArray.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{valuesArray.length - 3} more
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-gray-500 text-sm">
                    Click to select options...
                  </span>
                )}
              </div>
              <div className="ml-2 text-gray-400">{isExpanded ? "▼" : "▶"}</div>
            </div>
          </div>

          {/* Розгорнутий dropdown */}
          {isExpanded && (
            <div className="border rounded-lg p-3 bg-white shadow-sm">
              {/* Базові опції */}
              {options && options.length > 0 && (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Standard Options
                  </div>
                  {options.map((option: string) => (
                    <label
                      key={option}
                      className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-1 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={valuesArray.includes(option)}
                        onChange={(e) =>
                          handleMultiSelectChange(
                            name,
                            option,
                            e.target.checked
                          )
                        }
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                      <span className="text-sm text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {/* Custom опції (завжди показуємо, якщо є) */}
              {customOptions[name] && customOptions[name].length > 0 && (
                <div className="space-y-2 max-h-40 overflow-y-auto border-t pt-3 mt-3">
                  <div className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-2">
                    Custom Options
                  </div>
                  {customOptions[name].map((option: string) => (
                    <label
                      key={option}
                      className="flex items-center space-x-3 cursor-pointer hover:bg-blue-50 p-1 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={valuesArray.includes(option)}
                        onChange={(e) =>
                          handleMultiSelectChange(
                            name,
                            option,
                            e.target.checked
                          )
                        }
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                      <span className="text-sm text-blue-700 font-medium">
                        {option}
                      </span>
                      <span className="text-xs text-blue-500">(custom)</span>
                    </label>
                  ))}
                </div>
              )}

              {/* Custom "Other" секція */}
              <div className="border-t pt-3 mt-3">
                <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-1 rounded">
                  <input
                    type="checkbox"
                    checked={showCustomInput[name] || false}
                    onChange={(e) =>
                      setShowCustomInput((prev) => ({
                        ...prev,
                        [name]: e.target.checked,
                      }))
                    }
                    className="rounded border-gray-300 text-green-600 shadow-sm"
                  />
                  <span className="text-sm font-medium text-green-600">
                    + Add Custom Option
                  </span>
                </label>

                {showCustomInput[name] && (
                  <div className="mt-2 flex space-x-2">
                    <input
                      type="text"
                      value={customInputs[name] || ""}
                      onChange={(e) =>
                        setCustomInputs((prev) => ({
                          ...prev,
                          [name]: e.target.value,
                        }))
                      }
                      placeholder={`Enter custom ${label.toLowerCase()}...`}
                      className="flex-1 border rounded-lg px-3 py-2 text-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddCustomOption(name);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleAddCustomOption(name)}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>

              {/* Кнопка Close */}
              <div className="mt-3 text-center mb-4">
                <button
                  type="button"
                  onClick={() => toggleDropdown(name)}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }

    // Звичайні input поля
    return (
      <input
        type={type || "text"}
        value={data[name] ?? ""}
        onChange={(e) => handleChange(name, e.target.value)}
        className="border p-2 rounded bg-slate-50 font-extrabold text-gray-500 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        placeholder={`Enter ${label.toLowerCase()}...`}
      />
    );
  };

  const filteredFields = inspectionSchema.projectInformation
    .filter((field) => field.name !== "inspection_number")
    .sort((a, b) => a.order - b.order);

  const midpoint = Math.ceil(filteredFields.length / 2);
  const leftColumn = filteredFields.slice(0, midpoint);
  const rightColumn = filteredFields.slice(midpoint);

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Project Information</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[leftColumn, rightColumn].map((column, idx) => (
          <div key={idx} className="space-y-4">
            {column.map((field) => (
              <div key={field.name} className="flex flex-col space-y-2">
                <label className="font-semibold text-base text-gray-700">
                  {field.label}
                  {field.options && (
                    <span className="text-xs text-blue-600 ml-2 font-normal">
                      (Multi-select)
                    </span>
                  )}
                </label>

                {renderField(field)}

                {errors[field.name] && (
                  <span className="text-red-600 text-sm mt-1">
                    {errors[field.name]}
                  </span>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
