// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'cuti_provider.dart';

// **************************************************************************
// RiverpodGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, type=warning

@ProviderFor(cutiRepository)
final cutiRepositoryProvider = CutiRepositoryProvider._();

final class CutiRepositoryProvider
    extends $FunctionalProvider<CutiRepository, CutiRepository, CutiRepository>
    with $Provider<CutiRepository> {
  CutiRepositoryProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'cutiRepositoryProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$cutiRepositoryHash();

  @$internal
  @override
  $ProviderElement<CutiRepository> $createElement($ProviderPointer pointer) =>
      $ProviderElement(pointer);

  @override
  CutiRepository create(Ref ref) {
    return cutiRepository(ref);
  }

  /// {@macro riverpod.override_with_value}
  Override overrideWithValue(CutiRepository value) {
    return $ProviderOverride(
      origin: this,
      providerOverride: $SyncValueProvider<CutiRepository>(value),
    );
  }
}

String _$cutiRepositoryHash() => r'e3e567642ca08e1c880708d3e4eef11c5db7b848';

@ProviderFor(saldoCuti)
final saldoCutiProvider = SaldoCutiProvider._();

final class SaldoCutiProvider
    extends
        $FunctionalProvider<
          AsyncValue<List<SaldoCutiModel>>,
          List<SaldoCutiModel>,
          FutureOr<List<SaldoCutiModel>>
        >
    with
        $FutureModifier<List<SaldoCutiModel>>,
        $FutureProvider<List<SaldoCutiModel>> {
  SaldoCutiProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'saldoCutiProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$saldoCutiHash();

  @$internal
  @override
  $FutureProviderElement<List<SaldoCutiModel>> $createElement(
    $ProviderPointer pointer,
  ) => $FutureProviderElement(pointer);

  @override
  FutureOr<List<SaldoCutiModel>> create(Ref ref) {
    return saldoCuti(ref);
  }
}

String _$saldoCutiHash() => r'7ae07b621f0d3972e1e7e3a68f800558637726aa';

@ProviderFor(riwayatCuti)
final riwayatCutiProvider = RiwayatCutiProvider._();

final class RiwayatCutiProvider
    extends
        $FunctionalProvider<
          AsyncValue<List<CutiModel>>,
          List<CutiModel>,
          FutureOr<List<CutiModel>>
        >
    with $FutureModifier<List<CutiModel>>, $FutureProvider<List<CutiModel>> {
  RiwayatCutiProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'riwayatCutiProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$riwayatCutiHash();

  @$internal
  @override
  $FutureProviderElement<List<CutiModel>> $createElement(
    $ProviderPointer pointer,
  ) => $FutureProviderElement(pointer);

  @override
  FutureOr<List<CutiModel>> create(Ref ref) {
    return riwayatCuti(ref);
  }
}

String _$riwayatCutiHash() => r'541d706a4ce789c47bad52d491cf0ed7ab471501';

@ProviderFor(jenisCuti)
final jenisCutiProvider = JenisCutiProvider._();

final class JenisCutiProvider
    extends
        $FunctionalProvider<
          AsyncValue<List<JenisCutiModel>>,
          List<JenisCutiModel>,
          FutureOr<List<JenisCutiModel>>
        >
    with
        $FutureModifier<List<JenisCutiModel>>,
        $FutureProvider<List<JenisCutiModel>> {
  JenisCutiProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'jenisCutiProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$jenisCutiHash();

  @$internal
  @override
  $FutureProviderElement<List<JenisCutiModel>> $createElement(
    $ProviderPointer pointer,
  ) => $FutureProviderElement(pointer);

  @override
  FutureOr<List<JenisCutiModel>> create(Ref ref) {
    return jenisCuti(ref);
  }
}

String _$jenisCutiHash() => r'fe473ebc1c05091ad914ad0bb15b808a9e671e9d';

@ProviderFor(persetujuanCuti)
final persetujuanCutiProvider = PersetujuanCutiProvider._();

final class PersetujuanCutiProvider
    extends
        $FunctionalProvider<
          AsyncValue<List<CutiModel>>,
          List<CutiModel>,
          FutureOr<List<CutiModel>>
        >
    with $FutureModifier<List<CutiModel>>, $FutureProvider<List<CutiModel>> {
  PersetujuanCutiProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'persetujuanCutiProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$persetujuanCutiHash();

  @$internal
  @override
  $FutureProviderElement<List<CutiModel>> $createElement(
    $ProviderPointer pointer,
  ) => $FutureProviderElement(pointer);

  @override
  FutureOr<List<CutiModel>> create(Ref ref) {
    return persetujuanCuti(ref);
  }
}

String _$persetujuanCutiHash() => r'3167bf6b6bd254fb1cfbe225a3bf6d3ba95e31ca';

@ProviderFor(AjukanCutiAction)
final ajukanCutiActionProvider = AjukanCutiActionProvider._();

final class AjukanCutiActionProvider
    extends $AsyncNotifierProvider<AjukanCutiAction, void> {
  AjukanCutiActionProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'ajukanCutiActionProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$ajukanCutiActionHash();

  @$internal
  @override
  AjukanCutiAction create() => AjukanCutiAction();
}

String _$ajukanCutiActionHash() => r'892e7dce99959ad2fd4fbd0f6d35049d0f30fa21';

abstract class _$AjukanCutiAction extends $AsyncNotifier<void> {
  FutureOr<void> build();
  @$mustCallSuper
  @override
  void runBuild() {
    final ref = this.ref as $Ref<AsyncValue<void>, void>;
    final element =
        ref.element
            as $ClassProviderElement<
              AnyNotifier<AsyncValue<void>, void>,
              AsyncValue<void>,
              Object?,
              Object?
            >;
    element.handleCreate(ref, build);
  }
}

@ProviderFor(PimpinanCutiAction)
final pimpinanCutiActionProvider = PimpinanCutiActionProvider._();

final class PimpinanCutiActionProvider
    extends $AsyncNotifierProvider<PimpinanCutiAction, void> {
  PimpinanCutiActionProvider._()
    : super(
        from: null,
        argument: null,
        retry: null,
        name: r'pimpinanCutiActionProvider',
        isAutoDispose: true,
        dependencies: null,
        $allTransitiveDependencies: null,
      );

  @override
  String debugGetCreateSourceHash() => _$pimpinanCutiActionHash();

  @$internal
  @override
  PimpinanCutiAction create() => PimpinanCutiAction();
}

String _$pimpinanCutiActionHash() =>
    r'08bf83815b3e355d7488a030bcb49fa92eb3a7fe';

abstract class _$PimpinanCutiAction extends $AsyncNotifier<void> {
  FutureOr<void> build();
  @$mustCallSuper
  @override
  void runBuild() {
    final ref = this.ref as $Ref<AsyncValue<void>, void>;
    final element =
        ref.element
            as $ClassProviderElement<
              AnyNotifier<AsyncValue<void>, void>,
              AsyncValue<void>,
              Object?,
              Object?
            >;
    element.handleCreate(ref, build);
  }
}
